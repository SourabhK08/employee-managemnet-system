// app/dashboard/layout.js


import Sidebar from "@/components/ui-main/Sidebar";
import useAuth from "@/hooks/useAuth";


export default function DashboardLayout({ children }) {
  // Normally auth check backend se hota, but yahan simulate kar rahe
  const { user } = useAuth();

  if (!user) {
    return <div>Access Denied</div>; // Later you can redirect to /auth/login
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}
