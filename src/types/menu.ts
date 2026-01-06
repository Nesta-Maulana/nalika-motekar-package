// Module is imported from tenant.ts (more complete version)

export interface Menu {
  id: string;
  name: string;
  route?: string;
  icon?: string;
  permission?: string;
  order: number;
  is_visible: boolean;
  parent_id?: string;
  children?: Menu[];
  module_id?: string;
  created_at: string;
  updated_at: string;
}

export interface MenuTreeItem extends Menu {
  children: MenuTreeItem[];
  level: number;
  isExpanded?: boolean;
}

export interface CreateMenuDTO {
  name: string;
  route?: string;
  icon?: string;
  permission?: string;
  parent_id?: string;
  module_id?: string;
  is_visible?: boolean;
}

export interface UpdateMenuDTO {
  name?: string;
  route?: string;
  icon?: string;
  permission?: string;
  parent_id?: string;
  is_visible?: boolean;
}

export interface ReorderMenuDTO {
  items: {
    id: string;
    order: number;
    parent_id?: string;
  }[];
}
