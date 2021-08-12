export type PermissionModel = 'Drivers' | 'Loads' | 'Roles' | 'Users'
export const PermissionModel: Record<PermissionModel, PermissionModel> = {
  Drivers: 'Drivers',
  Loads: 'Loads',
  Roles: 'Roles',
  Users: 'Users',
}
