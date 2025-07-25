
import { hasPermission } from "@/components/ui-main/hasPermission";
import { useSelector } from "react-redux";

const usePermission = (permissionKey) => {
  const permissions = useSelector((state) => state.user.permissions);
  return hasPermission(permissions, permissionKey);
};

export default usePermission;
