import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";
import "./MainLayout.css";

function MainLayout({
  children,
  collapsed,
  setCollapsed,
  currentPage,
  onNavigate,
}) {
  return (
    <div className={collapsed ? "layout collapsedLayout" : "layout"}>

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        currentPage={currentPage}
        onNavigate={onNavigate}
      />

      {/* Main Area */}
      <main className="mainContent">

        {/* Navbar */}
        <Navbar />

        {/* Current Page */}
        <div className="pageContent">
          {children}
        </div>

      </main>

    </div>
  );
}

export default MainLayout;