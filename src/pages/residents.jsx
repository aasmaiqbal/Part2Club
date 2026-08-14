import "./Residents.css";

function Residents() {
  const residents = [
    {
      name: "Mrs. Ayesha Khan",
      age: 72,
      gender: "Female",
      room: "A-101",
      contact: "9876543210",
      status: "Stable",
    },
    {
      name: "Mr. Ahmed Ali",
      age: 68,
      gender: "Male",
      room: "A-102",
      contact: "9876543211",
      status: "Needs Attention",
    },
    {
      name: "Mrs. Sara Begum",
      age: 75,
      gender: "Female",
      room: "B-201",
      contact: "9876543212",
      status: "Stable",
    },
    {
      name: "Mr. Raj Sharma",
      age: 70,
      gender: "Male",
      room: "B-202",
      contact: "9876543213",
      status: "Stable",
    },
  ];

  return (
    <div className="residents">
      <div className="residentsHeader">
        <div>
          <h2>Residents</h2>
          <p>Manage resident information and care details</p>
        </div>

        <button className="addResidentBtn">
          + Add Resident
        </button>
      </div>

      <div className="residentSearch">
        <input
          type="text"
          placeholder="Search residents..."
        />
      </div>

      <div className="residentsTable">
        <table>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Room</th>
              <th>Contact</th>
              <th>Health Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {residents.map((resident, index) => (
              <tr key={index}>
                <td>{resident.name}</td>
                <td>{resident.age}</td>
                <td>{resident.gender}</td>
                <td>{resident.room}</td>
                <td>{resident.contact}</td>

                <td>
                  <span
                    className={`status ${
                      resident.status === "Stable"
                        ? "stable"
                        : "attention"
                    }`}
                  >
                    {resident.status}
                  </span>
                </td>

                <td>
                  <button className="viewBtn">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Residents;