import Cookies from "js-cookie";

export default function useAuth() {
  const token = Cookies.get("accessToken");

  const employee = token ? { name: "Sourabh" } : null;

  return { employee };
}
