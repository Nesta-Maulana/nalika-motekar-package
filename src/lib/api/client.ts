import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { storage } from '../utils/storage';
import { getDomainInfo } from '../../hooks/useDomainDetect';

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
};

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Only add tenant header for tenant subdomains and non-central endpoints
    const domainInfo = getDomainInfo();
    const isCentralEndpoint = config.url?.includes('/auth/central/');

    if (domainInfo.isTenant && domainInfo.tenantSlug && !isCentralEndpoint && config.headers) {
      config.headers['X-Tenant-Subdomain'] = domainInfo.tenantSlug;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = storage.getRefreshToken();

      if (!refreshToken) {
        storage.clearAuth();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { isCentral } = getDomainInfo();
        const refreshEndpoint = isCentral
          ? '/v1/auth/central/refresh'
          : '/v1/auth/refresh';

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}${refreshEndpoint}`,
          { refresh_token: refreshToken }
        );

        const { access_token, refresh_token: newRefreshToken } = response.data.data;

        storage.setToken(access_token);
        storage.setRefreshToken(newRefreshToken);

        processQueue(null, access_token);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        storage.clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      errors: error.response?.data?.errors,
      status: error.response?.status || 500,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;

export const setAuthHeader = (token: string) => {
  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
  delete apiClient.defaults.headers.common.Authorization;
};
