"use client";
import { AlignJustify, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [sidebarOpen, setsidebarOpen] = useState(true);

  const navItems = [
    {
      label: "Employee",
      href: "/dashboard",
      // permission: "view_employee",
    },
    {
      label: "Department",
      href: "/dashboard/profile",
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
                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="block px-1 py-2 rounded hover:bg-gray-700 transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
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
