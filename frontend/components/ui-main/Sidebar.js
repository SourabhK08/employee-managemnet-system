// components/Sidebar.js
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-34 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-4">EMS</h2>
      <nav>
        <ul className="space-y-2">
          <li><Link href="/dashboard">Employee</Link></li>
          <li><Link href="/dashboard/profile">Department</Link></li>
          <li><Link href="/dashboard/settings">Assign Task</Link></li>
          <li><Link href="/dashboard/settings">Attendance</Link></li>
          <li><Link href="/dashboard/settings">Leave</Link></li>
          <li><Link href="/dashboard/settings">Payroll</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
