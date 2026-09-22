import { useEffect, useState } from "react";
import "./Checkups.css";

const API = "http://127.0.0.1:5000";

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

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Checkups() {
  const [residents, setResidents] = useState([]);
  const [checkups, setCheckups] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCheckup, setSelectedCheckup] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newCheckup, setNewCheckup] = useState(emptyCheckup);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // LOAD RESIDENTS
  const loadResidents = async () => {
    try {
      const response = await fetch(`${API}/api/residents`);

      if (!response.ok) {
        throw new Error("Failed to load residents");
      }

      const data = await response.json();
      setResidents(data);
    } catch (error) {
      console.error("Error loading residents:", error);
      alert("Unable to load residents.");
    }
  };

  // LOAD CHECKUPS
  const loadCheckups = async () => {
    try {
      const response = await fetch(`${API}/api/checkups`);

      if (!response.ok) {
        throw new Error("Failed to load checkups");
      }

      const data = await response.json();
      setCheckups(data);
    } catch (error) {
      console.error("Error loading checkups:", error);
      alert("Unable to load checkups.");
    }
  };

  // LOAD EVERYTHING
  const loadData = async () => {
    try {
      setLoading(true);

      await Promise.all([
        loadResidents(),
        loadCheckups(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // GET RESIDENT NAME
  const getResidentName = (id) => {
    const resident = residents.find(
      (item) => item.resident_id === Number(id)
    );

    return resident ? resident.name : "Unknown Resident";
  };

  // OPEN ADD FORM
  const openAddForm = async () => {
    // Get the latest residents from database
    await loadResidents();

    setNewCheckup(emptyCheckup);
    setShowAddForm(true);
  };

  // SEARCH
  const filteredCheckups = checkups.filter((checkup) => {
    const residentName = getResidentName(checkup.resident_id);
    const search = searchTerm.toLowerCase().trim();

    return (
      residentName.toLowerCase().includes(search) ||
      (checkup.doctor || "").toLowerCase().includes(search) ||
      (checkup.checkup_type || "").toLowerCase().includes(search) ||
      (checkup.reason || "").toLowerCase().includes(search)
    );
  });

  // INPUT CHANGE
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewCheckup((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ADD CHECKUP
  const handleAddCheckup = async (e) => {
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

    try {
      setSaving(true);

      const checkupData = {
        resident_id: Number(newCheckup.resident_id),
        checkup_date: newCheckup.checkup_date,
        checkup_time: newCheckup.checkup_time,
        doctor: newCheckup.doctor,
        checkup_type: newCheckup.checkup_type,
        reason: newCheckup.reason,
        findings: newCheckup.findings,
        recommendations: newCheckup.recommendations,
        status: "Scheduled",
        completed: 0,
      };

      const response = await fetch(`${API}/api/checkups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkupData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add checkup");
      }

      alert("Checkup added successfully!");

      setNewCheckup(emptyCheckup);
      setShowAddForm(false);

      await loadCheckups();
    } catch (error) {
      console.error("Error adding checkup:", error);
      alert(`Unable to add checkup: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // CANCEL
  const handleCancel = () => {
    setNewCheckup(emptyCheckup);
    setShowAddForm(false);
  };

  // TOGGLE COMPLETED
  const toggleCompleted = async (checkup) => {
    try {
      const newCompleted = checkup.completed ? 0 : 1;

      const updatedCheckup = {
        resident_id: Number(checkup.resident_id),
        checkup_date: checkup.checkup_date,
        checkup_time: checkup.checkup_time,
        doctor: checkup.doctor,
        checkup_type: checkup.checkup_type,
        reason: checkup.reason,
        findings: checkup.findings,
        recommendations: checkup.recommendations,
        status: newCompleted ? "Completed" : "Scheduled",
        completed: newCompleted,
      };

      const response = await fetch(
        `${API}/api/checkups/${checkup.checkup_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCheckup),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update checkup");
      }

      await loadCheckups();

      if (
        selectedCheckup &&
        selectedCheckup.checkup_id === checkup.checkup_id
      ) {
        setSelectedCheckup({
          ...checkup,
          ...updatedCheckup,
          completed: Boolean(newCompleted),
        });
      }
    } catch (error) {
      console.error("Error updating checkup:", error);
      alert(`Unable to update checkup: ${error.message}`);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="checkups">
        <div className="checkupPageHeader">
          <div>
            <h2>Checkups</h2>
            <p>Loading checkups...</p>
          </div>
        </div>
      </div>
    );
  }

  // DETAILS PAGE
  if (selectedCheckup) {
    const currentCheckup =
      checkups.find(
        (item) => item.checkup_id === selectedCheckup.checkup_id
      ) || selectedCheckup;

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
            {getResidentName(currentCheckup.resident_id)}
          </p>
        </div>

        <div className="checkupProfileCard">
          <div className="checkupTitle">
            <div className="checkupIcon">🩺</div>

            <div>
              <h3>{currentCheckup.checkup_type}</h3>

              <span>
                {getResidentName(currentCheckup.resident_id)}
              </span>
            </div>
          </div>

          <div className="checkupInfoGrid">
            <div>
              <span>Resident</span>
              <strong>
                {getResidentName(currentCheckup.resident_id)}
              </strong>
            </div>

            <div>
              <span>Checkup Date</span>
              <strong>
                {formatDate(currentCheckup.checkup_date)}
              </strong>
            </div>

            <div>
              <span>Time</span>
              <strong>{currentCheckup.checkup_time}</strong>
            </div>

            <div>
              <span>Doctor</span>
              <strong>{currentCheckup.doctor}</strong>
            </div>

            <div>
              <span>Checkup Type</span>
              <strong>{currentCheckup.checkup_type}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong
                className={
                  currentCheckup.completed
                    ? "checkupCompletedText"
                    : "checkupPendingText"
                }
              >
                {currentCheckup.completed
                  ? "Completed"
                  : "Not Completed"}
              </strong>
            </div>
          </div>

          <div className="checkupDetailSection">
            <span>Reason / Symptoms</span>
            <strong>{currentCheckup.reason}</strong>
          </div>

          <div className="checkupDetailSection">
            <span>Findings / Diagnosis</span>
            <strong>
              {currentCheckup.findings || "Not recorded"}
            </strong>
          </div>

          <div className="checkupDetailSection">
            <span>Recommendations / Treatment</span>
            <strong>
              {currentCheckup.recommendations || "Not recorded"}
            </strong>
          </div>

          <div className="checkupCompletionBox">
            <label className="completionCheckbox">
              <input
                type="checkbox"
                checked={Boolean(currentCheckup.completed)}
                onChange={() =>
                  toggleCompleted(currentCheckup)
                }
              />

              <span>
                {currentCheckup.completed
                  ? "Checkup Completed"
                  : "Mark Checkup as Completed"}
              </span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // ADD FORM
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
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="checkupSaveBtn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Add Checkup"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // MAIN PAGE
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
          onClick={openAddForm}
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
                        checked={Boolean(checkup.completed)}
                        onChange={() =>
                          toggleCompleted(checkup)
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