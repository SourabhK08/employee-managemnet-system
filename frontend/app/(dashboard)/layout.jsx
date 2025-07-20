// app/dashboard/layout.js
"use client";
import Sidebar from "@/components/ui-main/Sidebar";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  // Normally auth check backend se hota, but yahan simulate kar rahe
  // const { employee } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!employee) {
  //     router.replace("/");
  //   }

  //   // Prevent back button cache bypass
  //   window.history.pushState(null, "", window.location.href);
  //   window.onpopstate = () => {
  //     window.location.reload();
  //   };
  // }, [employee]);

  // if (!employee) return null;

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
