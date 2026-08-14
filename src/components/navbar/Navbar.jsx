import "./Navbar.css";

import {
  FaBell,
  FaCalendarAlt,
  FaUserCircle,
  FaSearch
} from "react-icons/fa";

function Navbar(){
    const today = new Date();

    const day = today.toLocaleDateString("en-US", {
    weekday: "long",
    });

    const date = today.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    });
    return(
        <header className="navbar">
            <div className="searchContainer">
                <FaSearch className="searchIcon"/>
                <input
                    type="text"
                    placeholder="Search Resident..."
                />
            </div>
            <div className="rightSection">
                <div className="dateSection">
                    <h4>{day}</h4>
                    <p>{date}</p>
                </div>

                <div className="navIcons">
                    <button>
                        <FaBell/>
                    </button>
                    <button>
                        <FaCalendarAlt/>
                    </button>
                </div>

                <button className="loginBtn">
                    <FaUserCircle/>
                    <span>Login</span>
                </button>
            </div>
        </header>
    )
}

export default Navbar;