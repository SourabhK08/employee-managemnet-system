// app/dashboard/layout.js
"use client";
import Sidebar from "@/components/ui-main/Sidebar";
import useAuth from "@/hooks/useAuth";
import {
  useGetProfileQuery,
  useLazyGetProfileQuery,
} from "@/store/features/employeeSlice";
import { setUserProfile } from "@/store/userSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function DashboardLayout({ children }) {
  // Normally auth check backend se hota, but yahan simulate kar rahe
  // const { employee } = useAuth();
  const router = useRouter();

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

  const dispatch = useDispatch();
  const { data, isSuccess, error } = useGetProfileQuery();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUserProfile(data));
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (error && error.status === 401) {
      router.replace("/");
    }
  }, [error, router]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
