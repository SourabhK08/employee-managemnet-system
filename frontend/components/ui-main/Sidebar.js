"use client";
import { useLogoutEmployeeMutation } from "@/store/features/employeeSlice";
import { AlignJustify, LogOutIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Sidebar() {
  const router = useRouter();
  const [sidebarOpen, setsidebarOpen] = useState(true);

  const pathname = usePathname();

  const [logout] = useLogoutEmployeeMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged Out Successfully");
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (error) {
      toast.error(error.data.message || "Logout failed");
    }
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      // permission: "view_employee",
    },
    {
      label: "Employee",
      href: "/employee",
      // permission: "view_employee",
    },
    {
      label: "Department",
      href: "/department",
      // permission: "view_department",
    },
    {
      label: "Role",
      href: "/role",
      // permission: "view_department",
    },
    {
      label: "Assign Task",
      href: "/dashboard/settings",
      // permission: "assign_task",
    },
    {
      label: "Attendance",
      href: "/dashboard/settings",
      // permission: "view_attendance",
    },
    {
      label: "Leave",
      href: "/dashboard/settings",
      // permission: "manage_leave",
    },
    {
      label: "Payroll",
      href: "/dashboard/settings",
      // permission: "view_payroll",
    },
  ];

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

          {/* check permissions here (UserPermissions from api) == (given permission here) */}
          <nav>
            <ul className="space-y-2">
              {navItems.map((item, index) => {
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
