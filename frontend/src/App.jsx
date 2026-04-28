import { useState, useEffect } from "react";
import { auth, onAuthStateChanged } from "./firebase";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u ?? null));
  }, []);

  if (user === undefined)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          className="skeleton"
          style={{ width: 48, height: 48, borderRadius: "50%" }}
        />
      </div>
    );

  return user ? <Dashboard user={user} /> : <LoginPage />;
}
