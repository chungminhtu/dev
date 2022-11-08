export enum ERole {
  SuperAdmin = 'SuperAdmin',
}

export const RoleGroup = {
  ...ERole,
  Admin: [ERole.SuperAdmin],
};
