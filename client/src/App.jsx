import { useEffect, useState } from "react";
import LoginScreen from "./components/LoginScreen";
import Workspace from "./components/Workspace";
import Toast from "./components/Toast";
import { getToken } from "./lib/api";
import "./styles.css";

export default function App() {
  const [authenticated, setAuthenticated] = useState(Boolean(getToken()));
  const [toast, setToast] = useState({ message: "", kind: "success" });

  function notify(message, kind = "success") {
    setToast({ message, kind });
  }

  useEffect(() => {
    if (!toast.message) return;

    const id = setTimeout(
      () => setToast({ message: "", kind: "success" }),
      2800
    );

    return () => clearTimeout(id);
  }, [toast]);

  function logout() {
    setAuthenticated(false);
  }

  return (
    <>
      {authenticated ? (
        <Workspace onLogout={logout} notify={notify} />
      ) : (
        <LoginScreen
          onAuthenticated={() => setAuthenticated(true)}
          notify={notify}
        />
      )}

      <Toast item={toast} />
    </>
  );
}
