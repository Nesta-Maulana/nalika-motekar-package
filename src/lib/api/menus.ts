import apiClient from './client';
import { Menu } from '../../types';

export const menusApi = {
  async getUserMenus(): Promise<Menu[]> {
    const response = await apiClient.get<{ data: Menu[] }>('/v1/menus/user');
    return response.data.data;
  },

  async getAllMenus(): Promise<Menu[]> {
    const response = await apiClient.get<{ data: Menu[] }>('/v1/menus');
    return response.data.data;
  },

  async getMenuTree(): Promise<Menu[]> {
    const response = await apiClient.get<{ data: Menu[] }>('/v1/menus/tree');
    return response.data.data;
  },
};

export default menusApi;
