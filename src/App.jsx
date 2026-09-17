import { useState } from "react";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Residents from "./pages/Residents";

function App() {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "Residents":
        return <Residents />;

      case "Dashboard":
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout
      collapsed={collapsed}
      setCollapsed={setCollapsed}
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    >
      {renderPage()}
    </MainLayout>
  );
}

export default App;