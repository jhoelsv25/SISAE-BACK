/*
@Entity('role_permissions')
export class RolePermission {
  @ManyToOne(() => RoleEntity, role => role.permissions)
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity, permission => permission.roles)
  permission: PermissionEntity;
}

*/
