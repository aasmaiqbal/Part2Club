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

import {useState} from "react";
function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>

      <div className="topSection">

        <button className="menuBtn" onClick={()=>setCollapsed(!collapsed)}>
          <FaBars />
        </button>

        <div className="logoSection">
          <h2>🌿 Part2Club </h2>
          <p>Elderly home care management</p>
        </div>

      </div>

      <div className="menuHeading">
        MAIN MENU
      </div>

      <ul className="menuList">
        {menuItems.map((item, index) => (
          <li
            key={item.title}
            className={index === 0 ? "active" : ""}
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
