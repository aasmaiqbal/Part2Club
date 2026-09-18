import { useState } from "react";
import "./Checkups.css";

const residents = [
  { resident_id: 1, name: "Mrs. Ayesha Khan" },
  { resident_id: 2, name: "Mr. Ahmed Ali" },
  { resident_id: 3, name: "Mrs. Sara Begum" },
  { resident_id: 4, name: "Mr. Raj Sharma" },
];

const initialCheckups = [
  {
    checkup_id: 1,
    resident_id: 1,
    checkup_date: "2026-09-18",
    checkup_time: "10:30",
    doctor: "Dr. Rahul Mehta",
    checkup_type: "General Health Check",
    reason: "Routine health monitoring",
    findings: "Blood pressure stable. Overall condition satisfactory.",
    recommendations: "Continue current medicines and low salt diet.",
    status: "Scheduled",
    completed: false,
  },
  {
    checkup_id: 2,
    resident_id: 2,
    checkup_date: "2026-09-18",
    checkup_time: "12:00",
    doctor: "Dr. Rahul Mehta",
    checkup_type: "Diabetes Checkup",
    reason: "Blood sugar monitoring",
    findings: "Blood sugar slightly elevated.",
    recommendations: "Continue medication and monitor blood sugar regularly.",
    status: "Scheduled",
    completed: false,
  },
  {
    checkup_id: 3,
    resident_id: 3,
    checkup_date: "2026-09-17",
    checkup_time: "11:00",
    doctor: "Dr. Rahul Mehta",
    checkup_type: "Routine Checkup",
    reason: "Regular health assessment",
    findings: "Health condition stable.",
    recommendations: "Continue balanced diet and daily walking.",
    status: "Completed",
    completed: true,
  },
  {
    checkup_id: 4,
    resident_id: 4,
    checkup_date: "2026-09-19",
    checkup_time: "15:00",
    doctor: "Dr. Rahul Mehta",
    checkup_type: "Cholesterol Review",
    reason: "Follow-up cholesterol assessment",
    findings: "Follow-up assessment required.",
    recommendations: "Continue low fat diet and prescribed medication.",
    status: "Scheduled",
    completed: false,
  },
];

const emptyCheckup = {
  resident_id: "",
  checkup_date: "",
  checkup_time: "",
  doctor: "",
  checkup_type: "",
  reason: "",
  findings: "",
  recommendations: "",
  completed: false,
};

function getResidentName(id) {
  const resident = residents.find(
    (item) => item.resident_id === Number(id)
  );

  return resident ? resident.name : "Unknown Resident";
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Checkups() {
  const [checkups, setCheckups] = useState(initialCheckups);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCheckup, setSelectedCheckup] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCheckup, setNewCheckup] = useState(emptyCheckup);

  const filteredCheckups = checkups.filter((checkup) => {
    const residentName = getResidentName(checkup.resident_id);
    const search = searchTerm.toLowerCase().trim();

    return (
      residentName.toLowerCase().includes(search) ||
      checkup.doctor.toLowerCase().includes(search) ||
      checkup.checkup_type.toLowerCase().includes(search) ||
      checkup.reason.toLowerCase().includes(search)
    );
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewCheckup({
      ...newCheckup,
      [name]: value,
    });
  };

  const handleAddCheckup = (e) => {
    e.preventDefault();

    if (
      !newCheckup.resident_id ||
      !newCheckup.checkup_date ||
      !newCheckup.checkup_time ||
      !newCheckup.doctor ||
      !newCheckup.checkup_type ||
      !newCheckup.reason
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const checkup = {
      checkup_id: Date.now(),
      ...newCheckup,
      resident_id: Number(newCheckup.resident_id),
      status: "Scheduled",
      completed: false,
    };

    setCheckups([...checkups, checkup]);
    setNewCheckup(emptyCheckup);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setNewCheckup(emptyCheckup);
    setShowAddForm(false);
  };

  const toggleCompleted = (checkupId) => {
    setCheckups((current) =>
      current.map((checkup) =>
        checkup.checkup_id === checkupId
          ? {
              ...checkup,
              completed: !checkup.completed,
              status: !checkup.completed
                ? "Completed"
                : "Scheduled",
            }
          : checkup
      )
    );
  };

  if (selectedCheckup) {
    return (
      <div className="checkups">
        <div className="checkupHeader">
          <button
            className="checkupBackBtn"
            onClick={() => setSelectedCheckup(null)}
          >
            ← Back to Checkups
          </button>

          <h2>Checkup Details</h2>

          <p>
            {getResidentName(selectedCheckup.resident_id)}
          </p>
        </div>

        <div className="checkupProfileCard">
          <div className="checkupTitle">
            <div className="checkupIcon">🩺</div>

            <div>
              <h3>{selectedCheckup.checkup_type}</h3>

              <span>
                {getResidentName(selectedCheckup.resident_id)}
              </span>
            </div>
          </div>

          <div className="checkupInfoGrid">
            <div>
              <span>Resident</span>
              <strong>
                {getResidentName(selectedCheckup.resident_id)}
              </strong>
            </div>

            <div>
              <span>Checkup Date</span>
              <strong>
                {formatDate(selectedCheckup.checkup_date)}
              </strong>
            </div>

            <div>
              <span>Time</span>
              <strong>{selectedCheckup.checkup_time}</strong>
            </div>

            <div>
              <span>Doctor</span>
              <strong>{selectedCheckup.doctor}</strong>
            </div>

            <div>
              <span>Checkup Type</span>
              <strong>{selectedCheckup.checkup_type}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong
                className={
                  selectedCheckup.completed
                    ? "checkupCompletedText"
                    : "checkupPendingText"
                }
              >
                {selectedCheckup.completed
                  ? "Completed"
                  : "Not Completed"}
              </strong>
            </div>
          </div>

          <div className="checkupDetailSection">
            <span>Reason / Symptoms</span>
            <strong>{selectedCheckup.reason}</strong>
          </div>

          <div className="checkupDetailSection">
            <span>Findings / Diagnosis</span>
            <strong>
              {selectedCheckup.findings || "Not recorded"}
            </strong>
          </div>

          <div className="checkupDetailSection">
            <span>Recommendations / Treatment</span>
            <strong>
              {selectedCheckup.recommendations || "Not recorded"}
            </strong>
          </div>

          <div className="checkupCompletionBox">
            <label className="completionCheckbox">
              <input
                type="checkbox"
                checked={selectedCheckup.completed}
                onChange={() =>
                  toggleCompleted(selectedCheckup.checkup_id)
                }
              />

              <span>
                {selectedCheckup.completed
                  ? "Checkup Completed"
                  : "Mark Checkup as Completed"}
              </span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div className="checkups">
        <div className="checkupHeader">
          <button className="checkupBackBtn" onClick={handleCancel}>
            ← Back to Checkups
          </button>

          <h2>Add Checkup</h2>

          <p>Schedule a checkup for a resident</p>
        </div>

        <form
          className="addCheckupForm"
          onSubmit={handleAddCheckup}
        >
          <div className="checkupFormGrid">
            <div className="checkupFormGroup">
              <label>
                Resident <span>*</span>
              </label>

              <select
                name="resident_id"
                value={newCheckup.resident_id}
                onChange={handleInputChange}
              >
                <option value="">Select resident</option>

                {residents.map((resident) => (
                  <option
                    key={resident.resident_id}
                    value={resident.resident_id}
                  >
                    {resident.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="checkupFormGroup">
              <label>
                Checkup Date <span>*</span>
              </label>

              <input
                type="date"
                name="checkup_date"
                value={newCheckup.checkup_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="checkupFormGroup">
              <label>
                Time <span>*</span>
              </label>

              <input
                type="time"
                name="checkup_time"
                value={newCheckup.checkup_time}
                onChange={handleInputChange}
              />
            </div>

            <div className="checkupFormGroup">
              <label>
                Doctor <span>*</span>
              </label>

              <select
                name="doctor"
                value={newCheckup.doctor}
                onChange={handleInputChange}
              >
                <option value="">Select doctor</option>
                <option value="Dr. Rahul Mehta">
                  Dr. Rahul Mehta
                </option>
              </select>
            </div>

            <div className="checkupFormGroup">
              <label>
                Checkup Type <span>*</span>
              </label>

              <select
                name="checkup_type"
                value={newCheckup.checkup_type}
                onChange={handleInputChange}
              >
                <option value="">Select checkup type</option>
                <option value="General Health Check">
                  General Health Check
                </option>
                <option value="Routine Checkup">
                  Routine Checkup
                </option>
                <option value="Diabetes Checkup">
                  Diabetes Checkup
                </option>
                <option value="Blood Pressure Check">
                  Blood Pressure Check
                </option>
                <option value="Cholesterol Review">
                  Cholesterol Review
                </option>
                <option value="Follow-up Checkup">
                  Follow-up Checkup
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="checkupFormGroup">
              <label>
                Reason / Symptoms <span>*</span>
              </label>

              <input
                type="text"
                name="reason"
                value={newCheckup.reason}
                onChange={handleInputChange}
                placeholder="e.g. Routine health monitoring"
              />
            </div>

            <div className="checkupFormGroup fullCheckupWidth">
              <label>Findings / Diagnosis</label>

              <textarea
                name="findings"
                value={newCheckup.findings}
                onChange={handleInputChange}
                placeholder="Enter findings or diagnosis"
                rows="3"
              />
            </div>

            <div className="checkupFormGroup fullCheckupWidth">
              <label>Recommendations / Treatment</label>

              <textarea
                name="recommendations"
                value={newCheckup.recommendations}
                onChange={handleInputChange}
                placeholder="Enter recommendations or treatment"
                rows="3"
              />
            </div>
          </div>

          <div className="checkupFormActions">
            <button
              type="button"
              className="checkupCancelBtn"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button type="submit" className="checkupSaveBtn">
              Add Checkup
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="checkups">
      <div className="checkupPageHeader">
        <div>
          <h2>Checkups</h2>

          <p>
            Manage resident medical checkups and appointments
          </p>
        </div>

        <button
          className="addCheckupBtn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Checkup
        </button>
      </div>

      <div className="checkupSearch">
        <input
          type="text"
          placeholder="Search resident, doctor or checkup..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="checkupTable">
        <table>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Date</th>
              <th>Time</th>
              <th>Checkup Type</th>
              <th>Doctor</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCheckups.length > 0 ? (
              filteredCheckups.map((checkup) => (
                <tr key={checkup.checkup_id}>
                  <td>
                    <strong>
                      {getResidentName(checkup.resident_id)}
                    </strong>
                  </td>

                  <td>
                    {formatDate(checkup.checkup_date)}
                  </td>

                  <td>{checkup.checkup_time}</td>

                  <td>
                    <div className="checkupNameCell">
                      <div className="checkupSmallIcon">
                        🩺
                      </div>

                      <span>{checkup.checkup_type}</span>
                    </div>
                  </td>

                  <td>{checkup.doctor}</td>

                  <td>
                    <label className="tableCompletionCheckbox">
                      <input
                        type="checkbox"
                        checked={checkup.completed}
                        onChange={() =>
                          toggleCompleted(checkup.checkup_id)
                        }
                      />

                      <span>
                        {checkup.completed
                          ? "Completed"
                          : "Not Completed"}
                      </span>
                    </label>
                  </td>

                  <td>
                    <button
                      className="checkupViewBtn"
                      onClick={() =>
                        setSelectedCheckup(checkup)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="noCheckups">
                  No checkups found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Checkups;