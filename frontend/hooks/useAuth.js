// hooks/useAuth.js
export default function useAuth() {
  // Yeh sirf frontend simulation ke liye hai
  const user = { name: "John Doe", role: "admin" }; // null kar de agar login na ho
  return { user };
}
