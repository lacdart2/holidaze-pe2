import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { useAuthStore } from "./store/authStore";
import { loadUserFromStorage } from "./store/authStore";
import { Toaster } from "react-hot-toast";

export default function App() {
  const setUser = useAuthStore((state) => state.setUser);

  // load user from localStorage
  useEffect(() => {
    const user = loadUserFromStorage();
    if (user) setUser(user);
  }, [setUser]);

  return (
    <>
      <Toaster position="top-right" />
      <AppRouter />
    </>
  );
}