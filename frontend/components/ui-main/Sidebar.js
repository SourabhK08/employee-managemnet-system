"use client";
import usePermission from "@/hooks/useCheckPermission";
import { useLogoutEmployeeMutation } from "@/store/features/employeeSlice";
import { logoutUser } from "@/store/userSlice";
import { AlignJustify, LogOutIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function Sidebar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const pathname = usePathname();
  const [logout] = useLogoutEmployeeMutation();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleMobileNavClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

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
      href: "/assign-task",
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
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {(!sidebarOpen || isMobile) && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 text-white p-2 rounded-md shadow-lg hover:bg-gray-700 transition-colors"
        >
          <AlignJustify className="w-6 h-6" />
        </button>
      )}

      <aside
        className={`
          fixed md:relative
          top-0 left-0
          h-screen
          bg-gray-800 text-white
          transition-all duration-300 ease-in-out
          z-50 md:z-auto
          w-40 md:w-44
          text-sm md:text-base
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden"
          }
        `}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="md:text-xl text-lg font-bold">EMS</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden hover:text-red-400 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-2">
              {visibleNavItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      onClick={handleMobileNavClick}
                      className={`
                        block px-3 py-2 rounded transition-colors
                        ${
                          isActive
                            ? "bg-gray-700 font-semibold text-white"
                            : "hover:bg-gray-700 text-gray-300 hover:text-white"
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 pt-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded transition-colors"
              >
                <LogOutIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
