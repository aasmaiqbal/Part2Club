import { useEffect, useState } from "react";
import "./Residents.css";

const API = "http://127.0.0.1:5000";

const emptyResident = {
  name: "",
  date_of_birth: "",
  age: "",
  gender: "",
  room_no: "",
  contact: "",
  emergency_contact: "",
  address: "",
  health_status: "Stable",
  blood_type: "",
  staff_assigned: "",
  medical_history: "",
  allergies: "",
  medicines: "",
  diet: "",
  blood_pressure: "",
  sugar: "",
  pulse: "",
  oxygen: "",
  weight: "",
  height: "",
  other_notes: "",
  upcoming_appointment: "",
  birthday: "",
  profile_image: null,
  profile_image_preview: null,
};

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return "";

  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 0 ? age : "";
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Residents() {
  const [residents, setResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResident, setSelectedResident] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResident, setNewResident] = useState(emptyResident);
  const [loading, setLoading] = useState(true);

  // LOAD RESIDENTS FROM FLASK + SQLITE
  const loadResidents = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API}/api/residents`);

      if (!response.ok) {
        throw new Error("Could not load residents");
      }

      const data = await response.json();

      setResidents(data);
    } catch (error) {
      console.error("Error loading residents:", error);
      alert("Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResidents();
  }, []);

  const filteredResidents = residents.filter((resident) =>
    (resident.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "date_of_birth") {
      setNewResident({
        ...newResident,
        date_of_birth: value,
        birthday: value,
        age: calculateAge(value),
      });
      return;
    }

    setNewResident({
      ...newResident,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB.");
      return;
    }

    const preview = URL.createObjectURL(file);

    setNewResident({
      ...newResident,
      profile_image: file,
      profile_image_preview: preview,
    });
  };

  // SAVE NEW RESIDENT TO FLASK + SQLITE
  const handleAddResident = async (e) => {
    e.preventDefault();

    if (
      !newResident.name ||
      !newResident.date_of_birth ||
      !newResident.gender ||
      !newResident.room_no ||
      !newResident.contact
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const residentData = {
      name: newResident.name,
      date_of_birth: newResident.date_of_birth,
      age: newResident.age,
      gender: newResident.gender,
      room_no: newResident.room_no,
      contact: newResident.contact,
      emergency_contact: newResident.emergency_contact,
      address: newResident.address,
      health_status: newResident.health_status,
      blood_type: newResident.blood_type,
      staff_assigned: newResident.staff_assigned,
      medical_history: newResident.medical_history,
      allergies: newResident.allergies,
      medicines: newResident.medicines,
      diet: newResident.diet,
      blood_pressure: newResident.blood_pressure,
      sugar: newResident.sugar,
      pulse: newResident.pulse,
      oxygen: newResident.oxygen,
      weight: newResident.weight,
      height: newResident.height,
      other_notes: newResident.other_notes,
      upcoming_appointment: newResident.upcoming_appointment,
      birthday: newResident.birthday,
      profile_image: null,
    };

    try {
      const response = await fetch(`${API}/api/residents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(residentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add resident");
      }

      alert("Resident added successfully!");

      await loadResidents();

      setNewResident({ ...emptyResident });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding resident:", error);

      alert(`Could not add resident: ${error.message}`);
    }
  };

  const handleCancelAdd = () => {
    setNewResident({ ...emptyResident });
    setShowAddForm(false);
  };

  // RESIDENT PROFILE
  if (selectedResident) {
    return (
      <div className="residentProfile">
        <div className="profileHeader">
          <button
            className="backBtn"
            onClick={() => setSelectedResident(null)}
          >
            ← Back to Residents
          </button>

          <h2>{selectedResident.name}</h2>
        </div>

        <div className="profileCard">
          <div className="profileTop">
            <div className="profilePhoto">
              {selectedResident.profile_image ? (
                <img
                  src={selectedResident.profile_image}
                  alt={selectedResident.name}
                />
              ) : (
                selectedResident.name?.charAt(0)
              )}
            </div>

            <div className="basicInfo">
              <div className="infoRow">
                <div className="infoItem">
                  <span>Age</span>
                  <strong>{selectedResident.age} years</strong>
                </div>

                <div className="infoItem">
                  <span>Gender</span>
                  <strong>{selectedResident.gender}</strong>
                </div>
              </div>

              <div className="infoRow">
                <div className="infoItem">
                  <span>Room</span>
                  <strong>{selectedResident.room_no}</strong>
                </div>

                <div className="infoItem">
                  <span>Contact</span>
                  <strong>{selectedResident.contact}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="profileSection">
            <div className="infoRow">
              <div className="infoItem">
                <span>Blood Type</span>
                <strong>{selectedResident.blood_type || "—"}</strong>
              </div>

              <div className="infoItem">
                <span>Staff Assigned</span>
                <strong>{selectedResident.staff_assigned || "—"}</strong>
              </div>
            </div>

            <div className="infoRow">
              <div className="infoItem">
                <span>Emergency Contact</span>
                <strong>
                  {selectedResident.emergency_contact || "—"}
                </strong>
              </div>

              <div className="infoItem">
                <span>Address</span>
                <strong>{selectedResident.address || "—"}</strong>
              </div>
            </div>
          </div>

          <div className="profileSection">
            <div className="infoRow">
              <div className="fullInfo">
                <span>Medical History</span>
                <strong>
                  {selectedResident.medical_history || "—"}
                </strong>
              </div>

              <div className="fullInfo">
                <span>Allergies</span>
                <strong>{selectedResident.allergies || "—"}</strong>
              </div>
            </div>

            <div className="infoRow">
              <div className="fullInfo">
                <span>Medicines</span>
                <strong>{selectedResident.medicines || "—"}</strong>
              </div>

              <div className="fullInfo">
                <span>Diet</span>
                <strong>{selectedResident.diet || "—"}</strong>
              </div>
            </div>
          </div>

          <div className="healthSection">
            <h3>Health Information</h3>

            <div className="healthGrid">
              <div className="healthItem">
                <span>Health Status</span>

                <strong
                  className={
                    selectedResident.health_status === "Stable"
                      ? "healthStable"
                      : "healthAttention"
                  }
                >
                  {selectedResident.health_status}
                </strong>
              </div>

              <div className="healthItem">
                <span>Blood Pressure</span>
                <strong>
                  {selectedResident.blood_pressure || "—"}
                </strong>
              </div>

              <div className="healthItem">
                <span>Sugar</span>
                <strong>{selectedResident.sugar || "—"}</strong>
              </div>

              <div className="healthItem">
                <span>Pulse</span>
                <strong>{selectedResident.pulse || "—"}</strong>
              </div>

              <div className="healthItem">
                <span>Oxygen</span>
                <strong>{selectedResident.oxygen || "—"}</strong>
              </div>

              <div className="healthItem">
                <span>Weight</span>
                <strong>{selectedResident.weight || "—"}</strong>
              </div>

              <div className="healthItem">
                <span>Height</span>
                <strong>{selectedResident.height || "—"}</strong>
              </div>

              <div className="healthItem">
                <span>Other Notes</span>
                <strong>{selectedResident.other_notes || "—"}</strong>
              </div>
            </div>
          </div>

          <div className="profileSection">
            <div className="infoRow">
              <div className="infoItem">
                <span>Date of Birth</span>
                <strong>
                  {formatDate(selectedResident.date_of_birth)}
                </strong>
              </div>

              <div className="infoItem">
                <span>Upcoming Appointment</span>
                <strong>
                  {formatDateTime(
                    selectedResident.upcoming_appointment
                  )}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ADD RESIDENT FORM
  if (showAddForm) {
    return (
      <div className="residents">
        <div className="profileHeader">
          <button className="backBtn" onClick={handleCancelAdd}>
            ← Back to Residents
          </button>

          <h2>Add Resident</h2>
          <p>Enter the details of the new resident</p>
        </div>

        <form className="addResidentForm" onSubmit={handleAddResident}>
          <div className="formGrid">

            <div className="formGroup imageGroup">
              <label>Profile Photo</label>

              <label className="imageUpload">
                {newResident.profile_image_preview ? (
                  <img
                    src={newResident.profile_image_preview}
                    alt="Resident preview"
                  />
                ) : (
                  <>
                    <div className="uploadIcon">📷</div>
                    <strong>Click to upload photo</strong>
                    <span>PNG, JPG up to 2MB</span>
                  </>
                )}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="formGroup">
              <label>
                Full Name <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={newResident.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </div>

            <div className="formGroup">
              <label>
                Date of Birth <span>*</span>
              </label>

              <input
                type="date"
                name="date_of_birth"
                value={newResident.date_of_birth}
                onChange={handleInputChange}
              />
            </div>

            <div className="formGroup">
              <label>Age</label>

              <input
                type="text"
                value={
                  newResident.age
                    ? `${newResident.age} years`
                    : "Auto-calculated"
                }
                readOnly
                className="readonlyInput"
              />
            </div>

            <div className="formGroup">
              <label>
                Gender <span>*</span>
              </label>

              <select
                name="gender"
                value={newResident.gender}
                onChange={handleInputChange}
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="formGroup">
              <label>
                Room Number <span>*</span>
              </label>

              <input
                type="text"
                name="room_no"
                value={newResident.room_no}
                onChange={handleInputChange}
                placeholder="Example: A-103"
              />
            </div>

            <div className="formGroup">
              <label>
                Contact Number <span>*</span>
              </label>

              <input
                type="tel"
                name="contact"
                value={newResident.contact}
                onChange={handleInputChange}
                placeholder="Enter contact number"
              />
            </div>

            <div className="formGroup">
              <label>Emergency Contact</label>

              <input
                type="tel"
                name="emergency_contact"
                value={newResident.emergency_contact}
                onChange={handleInputChange}
                placeholder="Enter emergency contact"
              />
            </div>

            <div className="formGroup">
              <label>Address</label>

              <textarea
                name="address"
                value={newResident.address}
                onChange={handleInputChange}
                placeholder="Enter full address"
                rows="3"
              />
            </div>

            <div className="formGroup">
              <label>Health Status</label>

              <select
                name="health_status"
                value={newResident.health_status}
                onChange={handleInputChange}
              >
                <option value="Stable">Stable</option>
                <option value="Needs Attention">
                  Needs Attention
                </option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Blood Type</label>

              <select
                name="blood_type"
                value={newResident.blood_type}
                onChange={handleInputChange}
              >
                <option value="">Select blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Staff Assigned</label>

              <select
                name="staff_assigned"
                value={newResident.staff_assigned}
                onChange={handleInputChange}
              >
                <option value="">Select staff</option>
                <option value="Nurse Maria">Nurse Maria</option>
                <option value="Nurse Sarah">Nurse Sarah</option>
                <option value="Nurse Aisha">Nurse Aisha</option>
                <option value="Nurse John">Nurse John</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Medical History</label>

              <textarea
                name="medical_history"
                value={newResident.medical_history}
                onChange={handleInputChange}
                placeholder="e.g. Diabetes, Hypertension"
                rows="3"
              />
            </div>

            <div className="formGroup">
              <label>Allergies</label>

              <input
                type="text"
                name="allergies"
                value={newResident.allergies}
                onChange={handleInputChange}
                placeholder="e.g. Penicillin, Nuts"
              />
            </div>

            <div className="formGroup">
              <label>Medicines</label>

              <input
                type="text"
                name="medicines"
                value={newResident.medicines}
                onChange={handleInputChange}
                placeholder="e.g. Amlodipine 5mg"
              />
            </div>

            <div className="formGroup">
              <label>Diet</label>

              <select
                name="diet"
                value={newResident.diet}
                onChange={handleInputChange}
              >
                <option value="">Select diet</option>
                <option value="Balanced Diet">Balanced Diet</option>
                <option value="Low Salt Diet">Low Salt Diet</option>
                <option value="Diabetic Diet">Diabetic Diet</option>
                <option value="Low Fat Diet">Low Fat Diet</option>
                <option value="Soft Diet">Soft Diet</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Blood Pressure</label>

              <input
                type="text"
                name="blood_pressure"
                value={newResident.blood_pressure}
                onChange={handleInputChange}
                placeholder="e.g. 128/82"
              />
            </div>

            <div className="formGroup">
              <label>Blood Sugar</label>

              <input
                type="text"
                name="sugar"
                value={newResident.sugar}
                onChange={handleInputChange}
                placeholder="e.g. 105 mg/dL"
              />
            </div>

            <div className="formGroup">
              <label>Pulse</label>

              <input
                type="text"
                name="pulse"
                value={newResident.pulse}
                onChange={handleInputChange}
                placeholder="e.g. 76 bpm"
              />
            </div>

            <div className="formGroup">
              <label>Oxygen</label>

              <input
                type="text"
                name="oxygen"
                value={newResident.oxygen}
                onChange={handleInputChange}
                placeholder="e.g. 98%"
              />
            </div>

            <div className="formGroup">
              <label>Weight</label>

              <input
                type="text"
                name="weight"
                value={newResident.weight}
                onChange={handleInputChange}
                placeholder="e.g. 62 kg"
              />
            </div>

            <div className="formGroup">
              <label>Height</label>

              <input
                type="text"
                name="height"
                value={newResident.height}
                onChange={handleInputChange}
                placeholder="e.g. 158 cm"
              />
            </div>

            <div className="formGroup">
              <label>Upcoming Appointment</label>

              <input
                type="datetime-local"
                name="upcoming_appointment"
                value={newResident.upcoming_appointment}
                onChange={handleInputChange}
              />
            </div>

            <div className="formGroup">
              <label>Other Notes</label>

              <textarea
                name="other_notes"
                value={newResident.other_notes}
                onChange={handleInputChange}
                placeholder="Any additional health or care notes"
                rows="3"
              />
            </div>
          </div>

          <div className="formActions">
            <button
              type="button"
              className="cancelBtn"
              onClick={handleCancelAdd}
            >
              Cancel
            </button>

            <button type="submit" className="saveResidentBtn">
              Add Resident
            </button>
          </div>
        </form>
      </div>
    );
  }

  // RESIDENT LIST
  return (
    <div className="residents">
      <div className="residentsHeader">
        <div>
          <h2>Residents</h2>
          <p>Manage resident information and care details</p>
        </div>

        <button
          className="addResidentBtn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Resident
        </button>
      </div>

      <div className="residentSearch">
        <input
          type="text"
          placeholder="Search resident..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            {loading ? (
              <tr>
                <td colSpan="7" className="noResidents">
                  Loading residents...
                </td>
              </tr>
            ) : filteredResidents.length > 0 ? (
              filteredResidents.map((resident) => (
                <tr key={resident.resident_id}>
                  <td>
                    <div className="residentNameCell">
                      <div className="tableResidentPhoto">
                        {resident.profile_image ? (
                          <img
                            src={resident.profile_image}
                            alt={resident.name}
                          />
                        ) : (
                          resident.name?.charAt(0)
                        )}
                      </div>

                      <span>{resident.name}</span>
                    </div>
                  </td>

                  <td>{resident.age}</td>
                  <td>{resident.gender}</td>
                  <td>{resident.room_no}</td>
                  <td>{resident.contact}</td>

                  <td>
                    <span
                      className={
                        resident.health_status === "Stable"
                          ? "status stable"
                          : "status attention"
                      }
                    >
                      {resident.health_status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="viewBtn"
                      onClick={() => setSelectedResident(resident)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="noResidents">
                  No residents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Residents;