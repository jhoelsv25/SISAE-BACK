export interface ModuleTree {
  id: string;
  name: string;
  description?: string;
  path?: string;
  icon?: string;
  visibility?: 'private' | 'public';
  permissions: string[];
  children: ModuleTree[];
  parentId: string | null;
}

export interface ModuleMap {
  id: string;
  name: string;
  description?: string;
  path?: string;
  icon?: string;
  visibility?: 'private' | 'public';
  permissions: string[];
  children?: ModuleMap[];
}
export interface RoleByModule {
  role: { id: string; name: string };
  modules: ModuleMap[];
}

export interface RoleByModulePaginated {
  role: { id: string; name: string };
  modules: ModuleMap[];
  total: number;
  page: number;
  size: number;
}
