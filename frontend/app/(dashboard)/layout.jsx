"use client";
import Sidebar from "@/components/ui-main/Sidebar";
import { useLazyGetProfileQuery } from "@/store/features/employeeSlice";
import { setUserProfile, logoutUser } from "@/store/userSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const user = useSelector((state) => state.user.user);

  // Check authentication status from localStorage
  const isAuthenticated =
    typeof window !== "undefined"
      ? localStorage.getItem("isAuthenticated") === "true"
      : false;

  // Lazy profile query
  const [triggerGetProfile, { data, isSuccess, error, isLoading }] =
    useLazyGetProfileQuery();

  // Initialize user from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("userProfile");
      const savedAuth = localStorage.getItem("isAuthenticated");

      if (savedAuth === "true" && savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          dispatch(setUserProfile(parsedProfile));
        } catch (error) {
          console.error("Error parsing saved profile:", error);
          // Clear corrupted data
          localStorage.removeItem("userProfile");
          localStorage.removeItem("isAuthenticated");
        }
      }

      setIsInitialized(true);
    }
  }, [dispatch]);

  // Fetch fresh profile data when authenticated and initialized
  useEffect(() => {
    const fetchProfile = async () => {
      if (isInitialized && isAuthenticated && !user) {
        setIsProfileLoading(true);
        try {
          await triggerGetProfile().unwrap();
        } catch (err) {
          console.error("Failed to fetch profile:", err);
        } finally {
          setIsProfileLoading(false);
        }
      }
    };

    fetchProfile();
  }, [isInitialized, isAuthenticated, user, triggerGetProfile]);

  // Update Redux store when fresh profile data is received
  useEffect(() => {
    if (isSuccess && data && data.success) {
      dispatch(setUserProfile(data));
      localStorage.setItem("userProfile", JSON.stringify(data));
    }
  }, [isSuccess, data, dispatch]);

  // Handle authentication errors
  useEffect(() => {
    if (error) {
      console.error("Profile fetch error:", error);

      if (error.status === 401 || error.status === 403) {
        // Clear all auth data
        dispatch(logoutUser());
        localStorage.removeItem("userProfile");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token"); // If you store token

        router.replace("/");
      }
    }
  }, [error, dispatch, router]);

  // Redirect logic
  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated) {
        router.replace("/");
      } else if (!user && !isLoading && !isProfileLoading) {
        // If authenticated but no user data and not loading, redirect to login
        localStorage.removeItem("userProfile");
        localStorage.removeItem("isAuthenticated");
        router.replace("/");
      }
    }
  }, [
    isAuthenticated,
    user,
    isLoading,
    isProfileLoading,
    isInitialized,
    router,
  ]);

  // Show loading state
  if (!isInitialized || isProfileLoading || (isLoading && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
