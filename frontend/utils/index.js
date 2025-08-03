export const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const getStatusColor = (status) => {
  if (!status) return;

  const statusLower = status.toLowerCase();

  switch (statusLower) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    case "completed":
      return "bg-green-100 text-green-800 border border-green-200";
    case "in-progress":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "overdue":
      return "bg-orange-100 text-orange-800 border border-orange-200";
    default:
      return;
  }
};

export const getPriorityColor = (priority) => {
  if (!priority) return "bg-gray-100 text-gray-800";

  const priorityLower = priority.toLowerCase();

  switch (priorityLower) {
    case "urgent":
    case "critical":
      return "bg-red-100 text-red-800 border border-red-200";

    case "high":
      return "bg-orange-100 text-orange-800 border border-orange-200";

    case "medium":
    case "normal":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";

    case "low":
      return "bg-green-100 text-green-800 border border-green-200";

    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

export const PriorityBadge = ({ priority, className = "" }) => {
  const colorClasses = getPriorityColor(priority);

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colorClasses} ${className}`}
    >
      {priority ? priority.toUpperCase() : "NORMAL"}
    </span>
  );
};

export const StatusBadge = ({ status, className = "" }) => {
  const colorClasses = getStatusColor(status);

  return (
    <span
      className={`px-3 py-1 rounded-full  font-medium ${colorClasses} ${className}`}
    >
      {status ? status.toUpperCase() : "UNKNOWN"}
    </span>
  );
};

// Progress Bar Component

// export const ProgressBar = ({ progress, className = "" }) => {
//   const percentage = Math.max(0, Math.min(100, progress || 0));

//   const getProgressColor = (percent) => {
//     if (percent >= 80) return "bg-green-500";
//     if (percent >= 60) return "bg-blue-500";
//     if (percent >= 40) return "bg-yellow-500";
//     if (percent >= 20) return "bg-orange-500";
//     return "bg-red-500";
//   };

//   return (
//     <div className={`w-full ${className}`}>
//       <div className="flex justify-between text-xs mb-1">
//         <span>Progress</span>
//         <span className="font-medium">{percentage}%</span>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-2">
//         <div
//           className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
//             percentage
//           )}`}
//           style={{ width: `${percentage}%` }}
//         ></div>
//       </div>
//     </div>
//   );
// };
