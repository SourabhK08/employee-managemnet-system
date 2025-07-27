"use client";
import usePermission from "@/hooks/useCheckPermission";
import { useLogoutEmployeeMutation } from "@/store/features/employeeSlice";
import { logoutUser } from "@/store/userSlice";
import { AlignJustify, LogOutIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function Sidebar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [sidebarOpen, setsidebarOpen] = useState(true);

  const pathname = usePathname();

  const [logout] = useLogoutEmployeeMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      dispatch(logoutUser());

      localStorage.removeItem("userProfile");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      toast.success("Logged Out Successfully");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      toast.error(error.data.message || "Logout failed");
      // dispatch(logoutUser());
      // localStorage.removeItem("userProfile");
      // localStorage.removeItem("isAuthenticated");
      // localStorage.removeItem("accessToken");
      // localStorage.removeItem("refreshToken");
    }
  };

  const canViewEmployee = usePermission("LIST_EMPLOYEE");
  const canViewDepartment = usePermission("LIST_DEPARTMENT");
  const canViewRole = usePermission("LIST_ROLE");
  const canViewTask = usePermission("VIEW_TASK");
  const canViewAttendance = usePermission("VIEW_ATTENDANCE");
  const canViewPayroll = usePermission("VIEW_PAYROLL");
  const canViewLeave = usePermission("VIEW_LEAVE");

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      show: true,
    },
    {
      label: "Employee",
      href: "/employee",
      show: canViewEmployee,
    },
    {
      label: "Department",
      href: "/department",
      show: canViewDepartment,
    },
    {
      label: "Role",
      href: "/role",
      show: canViewRole,
    },
    {
      label: "Assign Task",
      href: "/dashboard/settings",
      show: canViewTask,
    },
    {
      label: "My Tasks",
      href: "/my-tasks",
      show: true,
    },
    {
      label: "Attendance",
      href: "/dashboard/settings",
      show: canViewAttendance,
    },
    {
      label: "Leave",
      href: "/dashboard/settings",
      show: canViewLeave,
    },
    {
      label: "Payroll",
      href: "/dashboard/settings",
      show: canViewPayroll,
    },
  ];

  const visibleNavItems = navItems.filter((item) => item.show);

  return (
    <>
      {sidebarOpen && (
        <aside
          className={`w-34 h-screen bg-gray-800 text-white p-4 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">EMS</h2>
            <X
              className="w-5 h-5 cursor-pointer hover:text-red-400"
              onClick={() => setsidebarOpen(false)}
            />
          </div>

          <nav>
            <ul className="space-y-2">
              {visibleNavItems.map((item, index) => {
                const isActive = pathname === item.href;

                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`block px-1 py-2 rounded  transition ${
                        isActive
                          ? "bg-gray-700 font-semibold"
                          : "hover:bg-gray-700"
                      } `}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div
              className="mt-5 flex gap-2 items-center text-red-500 cursor-pointer "
              onClick={handleLogout}
            >
              <div>
                {" "}
                <LogOutIcon width={20} height={20} />{" "}
              </div>
              <button className="cursor-pointer">Logout</button>
            </div>
          </nav>
        </aside>
      )}
      <div>
        {!sidebarOpen && (
          <AlignJustify
            onClick={() => setsidebarOpen(true)}
            className="w-6 h-6 text-gray-700 cursor-pointer m-4"
          />
        )}
      </div>
    </>
  );
}
