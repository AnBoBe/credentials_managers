import React, { useState, useEffect } from "react";
import AppRouter from "./routes/appRouter";

function App() {
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || null
  );

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) setUserRole(null);
    else setUserRole(savedRole);
  }, []);

  return <AppRouter userRole={userRole} setUserRole={setUserRole} />;
}

export default App;
