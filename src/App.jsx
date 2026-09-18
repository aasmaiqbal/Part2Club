import { useState } from "react";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Residents from "./pages/Residents";
import Staff from "./pages/Staff";
import HealthRecords from "./pages/HealthRecords";
import Medicines from "./pages/Medicines";
import MealsDiet from "./pages/MealsDiet";
import Checkups from "./pages/Checkups";
import Activities from "./pages/Activities";

function App() {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const renderPage = () => {
  switch (currentPage) {
    case "Residents":
      return <Residents />;

    case "Staff":
      return <Staff />;

    case "Dashboard":
      return <Dashboard />;

    case "Health Records":
      return <HealthRecords />;

    case "Medicines":
      return <Medicines />;

    case "Meals & Diet":
      return <MealsDiet />;

    case "Checkups":
      return <Checkups />;

    case "Activities":
      return <Activities />;
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