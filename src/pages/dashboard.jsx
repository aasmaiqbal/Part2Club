import "./Dashboard.css";
import StatCard from "../components/statcard/StatCard";

import {
  FaUsers,
  FaUserNurse,
  FaHeartbeat,
  FaHandHoldingHeart,
  FaExclamationTriangle,
  FaBirthdayCake,
  FaClock,
  FaMoneyBillWave
} from "react-icons/fa";

function Dashboard() {
  const healthAlerts = [
    {
      name: "Mrs. Ayesha Khan",
      alert: "Blood pressure needs monitoring",
      time: "10:30 AM",
      priority: "High",
    },
    {
      name: "Mr. Ahmed Ali",
      alert: "Medication due",
      time: "12:00 PM",
      priority: "Medium",
    },
    {
      name: "Mrs. Sara Begum",
      alert: "Routine health check required",
      time: "2:00 PM",
      priority: "Low",
    },
  ];

  const birthdays = [
    {
      name: "Ayesha Khan",
      date: "August 10",
    },
    {
      name: "Ahmed Ali",
      date: "August 14",
    },
    {
      name: "Sara Begum",
      date: "August 18",
    },
  ];

  return (
    <div className="dashboard">

      <h2>Dashboard</h2>

      
      <div className="statsGrid">

        <StatCard
          title="Residents"
          value="15"
          icon={<FaUsers />}
          color="#728A6E"
        />

        <StatCard
          title="Staff"
          value="10"
          icon={<FaUserNurse />}
          color="#324D3E"
        />

        <StatCard
          title="Health Alerts"
          value="5"
          icon={<FaHeartbeat />}
          color="#8EA48B"
        />

        <StatCard
          title="Donations"
          value="₹15,350"
          icon={<FaHandHoldingHeart />}
          color="#58735A"
        />

      </div>

     
      <div className="dashboardPanels">

        
        <div className="dashboardPanel healthAlertsPanel">

          <div className="panelHeader">
            <div>
              <h3>Resident Health Alerts</h3>
              <p>Important health updates</p>
            </div>

            <div className="panelIcon">
              <FaExclamationTriangle />
            </div>
          </div>

          <div className="healthAlertList">

            {healthAlerts.map((item, index) => (
              <div className="healthAlert" key={index}>

                <div className="alertResident">
                  <div className="residentAvatar">
                    {item.name.charAt(0)}
                  </div>

                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.alert}</p>
                  </div>
                </div>

                <div className="alertDetails">
                  <span>{item.time}</span>

                  <span
                    className={`priority ${item.priority.toLowerCase()}`}
                  >
                    {item.priority}
                  </span>
                </div>

              </div>
            ))}

          </div>

          <button className="viewAllBtn">
            View All Alerts
          </button>

        </div>


        <div className="dashboardPanel birthdayPanel">

          <div className="panelHeader">
            <div>
              <h3>Upcoming Birthdays</h3>
              <p>Don't miss a celebration 🎉</p>
            </div>

            <div className="panelIcon">
              <FaBirthdayCake />
            </div>
          </div>

          <div className="birthdayList">

            {birthdays.map((person, index) => (
              <div className="birthdayItem" key={index}>

                <div className="birthdayAvatar">
                  <FaBirthdayCake />
                </div>

                <div className="birthdayInfo">
                  <h4>{person.name}</h4>
                  <p>{person.date}</p>
                </div>

              </div>
            ))}

          </div>

          <button className="viewAllBtn">
            View All Birthdays
          </button>

        </div>

      </div>
    <div className="dashboardBottom">

  
     <div className="dashboardSection scheduleSection">
      <div className="sectionHeader">
        <div>
          <h3>Upcoming Schedule</h3>
          <p>Today's activities and appointments</p>
        </div>

        <div className="sectionIcon">
          <FaClock />
        </div>
      </div>

      <div className="scheduleList">

        <div className="scheduleItem">
          <span className="scheduleTime">9:00 AM</span>
          <div>
            <strong>Yoga</strong>
            <p>Activity Room</p>
          </div>
        </div>

        <div className="scheduleItem">
          <span className="scheduleTime">11:00 AM</span>
          <div>
            <strong>Health Checkup</strong>
          <p>Dr. Sharma</p>
        </div>
      </div>

      <div className="scheduleItem">
        <span className="scheduleTime">1:00 PM</span>
        <div>
          <strong>Lunch</strong>
          <p>Dining Hall</p>
        </div>
      </div>

      <div className="scheduleItem">
        <span className="scheduleTime">4:00 PM</span>
        <div>
          <strong>Evening Walk</strong>
          <p>Garden Area</p>
        </div>
      </div>

      </div>
  </div>


  {/* Recent Donations */}
  <div className="dashboardSection donationSection">
    <div className="sectionHeader">
      <div>
        <h3>Recent Donations</h3>
        <p>Latest contributions</p>
      </div>

      <div className="sectionIcon">
        <FaMoneyBillWave />
      </div>
    </div>

    <div className="donationList">

      <div className="donationItem">
          <div>
            <strong>Anonymous Donor</strong>
           <p>Today</p>
          </div>
            <span>₹5,000</span>
        </div>

        <div className="donationItem">
          <div>
            <strong>Rahul Sharma</strong>
            <p>Yesterday</p>
          </div>
            <span>₹3,500</span>
        </div>

        <div className="donationItem">
          <div>
              <strong>Priya Mehta</strong>
              <p>August 12</p>
            </div>
              <span>₹2,000</span>
            </div>

          </div>

          <button className="viewAllButton">
             View All Donations
          </button>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;