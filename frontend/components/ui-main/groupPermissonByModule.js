// utils/groupPermissionsByModule.js

export const groupByModule = (permissions) => {
  const grouped = {};

  permissions.forEach((perm) => {
    const parts = perm.key.split("_");
    const module = parts.slice(1).join("_"); // EMPLOYEE
    if (!grouped[module]) {
      grouped[module] = [];
    }
    grouped[module].push(perm);
  });

  return grouped;
};
