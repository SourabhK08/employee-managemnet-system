// components/Sidebar.js
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-34 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <nav>
        <ul className="space-y-2">
          <li><Link href="/dashboard">Home</Link></li>
          <li><Link href="/dashboard/profile">Profile</Link></li>
          <li><Link href="/dashboard/settings">Settings</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
