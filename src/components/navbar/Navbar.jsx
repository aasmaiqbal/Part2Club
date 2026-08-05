import "./Navbar.css";

import {
  FaBell,
  FaCalendarAlt,
  FaUserCircle,
  FaSearch
} from "react-icons/fa";

function Navbar(){
    return(
        <header className="navbar">
            <div className="searchContainer">
                <FaSearch className="searchIcon"/>
                <input
                    type="text"
                    placeholder="Search Resident..."
                />
            </div>
            <div className="navIcons">
                <button>
                    <FaBell/>
                </button>

                <button>
                    <FaCalendarAlt/>
                </button>

                <button className="loginBtn">
                    <FaUserCircle/>
                    <span>Login</span>
                </button>

            </div>
        </header>
    )
}

export default Navbar;