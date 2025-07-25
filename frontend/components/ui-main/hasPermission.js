export const hasPermission = (permission = [], requiredPermission) => {
  return permission.includes(requiredPermission);
};
