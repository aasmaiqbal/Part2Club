import "./Sidebar.css";

import {
  FaHome,
  FaUsers,
  FaHeartbeat,
  FaPills,
  FaUtensils,
  FaCalendarCheck,
  FaUserMd,
  FaRunning,
  FaGift,
  FaUserFriends,
  FaCog,
  FaBars,
} from "react-icons/fa";

const menuItems = [
  { title: "Dashboard", icon: <FaHome /> },
  { title: "Residents", icon: <FaUsers /> },
  { title: "Health Records", icon: <FaHeartbeat /> },
  { title: "Medicines", icon: <FaPills /> },
  { title: "Meals & Diet", icon: <FaUtensils /> },
  { title: "Checkups", icon: <FaCalendarCheck /> },
  { title: "Staff", icon: <FaUserMd /> },
  { title: "Activities", icon: <FaRunning /> },
  { title: "Donations", icon: <FaGift /> },
  { title: "Visitors", icon: <FaUserFriends /> },
  { title: "Settings", icon: <FaCog /> },
];

function Sidebar({
  collapsed,
  setCollapsed,
  currentPage,
  onNavigate,
}) {
  return (
    <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>

      {/* Top Section */}
      <div className="topSection">

        <button
          className="menuBtn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FaBars />
        </button>

        <div className="logoSection">
          <h2>🌿 Part2Club</h2>
          <p>Elderly home care management</p>
        </div>

      </div>

      {/* Menu Heading */}
      <div className="menuHeading">
        MAIN MENU
      </div>

      {/* Navigation */}
      <ul className="menuList">

        {menuItems.map((item) => (
          <li
            key={item.title}
            className={currentPage === item.title ? "active" : ""}
            onClick={() => onNavigate(item.title)}
          >
            {item.icon}
            <span>{item.title}</span>
          </li>
        ))}

      </ul>

    </aside>
  );
}

export default Sidebar;