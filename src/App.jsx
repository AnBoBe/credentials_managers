import React, { useState } from "react";
import AppRouter from "./routes/appRouter.jsx";

function App() {
  // Estado global simple para el rol de usuario
  const [userRole, setUserRole] = useState(null); // 'admin' | 'user' | null

  return <AppRouter userRole={userRole} setUserRole={setUserRole} />;
}

export default App;
