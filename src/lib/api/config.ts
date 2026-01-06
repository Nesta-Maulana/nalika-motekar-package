import apiClient from './client';

export interface SiteBranding {
  name: string;
  logo_url: string;
  favicon_url: string;
  tagline: string;
  description: string;
}

export interface SiteTheme {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  sidebar_bg: string;
}

export interface SiteConfig {
  domain_type: 'central' | 'tenant';
  tenant_id?: string;
  branding: SiteBranding;
  theme: SiteTheme;
}

export interface SiteConfigResponse {
  success: boolean;
  message: string;
  data: SiteConfig;
}

export const configApi = {
  async getSiteConfig(): Promise<SiteConfig> {
    const response = await apiClient.get<SiteConfigResponse>('/v1/config/site');
    return response.data.data;
  },
};

export default configApi;
