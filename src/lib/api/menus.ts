import apiClient from './client';
import { Menu, CreateMenuDTO, UpdateMenuDTO, ReorderMenuDTO, Module } from '../../types';

export const menusApi = {
  async getUserMenus(): Promise<Menu[]> {
    const response = await apiClient.get<{ data: Menu[] }>('/v1/menus/user');
    return response.data.data;
  },

  async getMenus(): Promise<Menu[]> {
    const response = await apiClient.get<{ data: Menu[] }>('/v1/menus');
    return response.data.data;
  },

  async getAllMenus(): Promise<Menu[]> {
    return this.getMenus();
  },

  async getMenuTree(): Promise<Menu[]> {
    const response = await apiClient.get<{ data: Menu[] }>('/v1/menus/tree');
    return response.data.data;
  },

  async getMenu(id: string): Promise<Menu> {
    const response = await apiClient.get<{ data: Menu }>(`/v1/menus/${id}`);
    return response.data.data;
  },

  async createMenu(data: CreateMenuDTO): Promise<Menu> {
    const response = await apiClient.post<{ data: Menu }>('/v1/menus', data);
    return response.data.data;
  },

  async updateMenu(id: string, data: UpdateMenuDTO): Promise<Menu> {
    const response = await apiClient.put<{ data: Menu }>(`/v1/menus/${id}`, data);
    return response.data.data;
  },

  async deleteMenu(id: string): Promise<void> {
    await apiClient.delete(`/v1/menus/${id}`);
  },

  async reorderMenus(data: ReorderMenuDTO): Promise<void> {
    await apiClient.post('/v1/menus/reorder', data);
  },
};

export const modulesApi = {
  async getModules(): Promise<Module[]> {
    const response = await apiClient.get<{ data: Module[] }>('/v1/modules');
    return response.data.data;
  },

  async getModule(id: string): Promise<Module> {
    const response = await apiClient.get<{ data: Module }>(`/v1/modules/${id}`);
    return response.data.data;
  },

  async activateModule(id: string): Promise<void> {
    await apiClient.post(`/v1/modules/${id}/activate`);
  },

  async deactivateModule(id: string): Promise<void> {
    await apiClient.post(`/v1/modules/${id}/deactivate`);
  },
};

export default menusApi;
