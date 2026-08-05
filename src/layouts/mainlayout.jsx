import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";
import "./MainLayout.css";

function MainLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <div className="layout">
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />
            <main
                className={collapsed ? "mainContent collapsed" : "mainContent"}
            >
                <Navbar />
                <div className="pageContent">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default MainLayout;