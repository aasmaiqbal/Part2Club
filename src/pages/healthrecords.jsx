import { useState } from "react";
import "./HealthRecords.css";

const residents = [
  { resident_id: 1, name: "Mrs. Ayesha Khan" },
  { resident_id: 2, name: "Mr. Ahmed Ali" },
  { resident_id: 3, name: "Mrs. Sara Begum" },
  { resident_id: 4, name: "Mr. Raj Sharma" },
];

const initialRecords = [
  {
    record_id: 1,
    resident_id: 1,
    record_date: "2026-09-15T09:30",
    blood_pressure: "128/82",
    sugar: "105 mg/dL",
    pulse: "76 bpm",
    oxygen: "98%",
    temperature: "36.6°C",
    weight: "62 kg",
    height: "158 cm",
    health_status: "Stable",
    symptoms: "Mild joint pain",
    diagnosis: "Hypertension, Arthritis",
    notes: "Continue regular monitoring",
    recorded_by: "Nurse Maria",
  },
  {
    record_id: 2,
    resident_id: 2,
    record_date: "2026-09-15T10:00",
    blood_pressure: "135/85",
    sugar: "145 mg/dL",
    pulse: "80 bpm",
    oxygen: "97%",
    temperature: "36.8°C",
    weight: "70 kg",
    height: "172 cm",
    health_status: "Needs Attention",
    symptoms: "Increased thirst",
    diagnosis: "Diabetes",
    notes: "Blood sugar monitoring required",
    recorded_by: "Nurse Sarah",
  },
  {
    record_id: 3,
    resident_id: 3,
    record_date: "2026-09-16T09:15",
    blood_pressure: "122/80",
    sugar: "98 mg/dL",
    pulse: "74 bpm",
    oxygen: "99%",
    temperature: "36.5°C",
    weight: "59 kg",
    height: "155 cm",
    health_status: "Stable",
    symptoms: "No major symptoms",
    diagnosis: "Mild Arthritis",
    notes: "Daily walking recommended",
    recorded_by: "Nurse Maria",
  },
  {
    record_id: 4,
    resident_id: 4,
    record_date: "2026-09-16T10:30",
    blood_pressure: "125/80",
    sugar: "102 mg/dL",
    pulse: "72 bpm",
    oxygen: "98%",
    temperature: "36.6°C",
    weight: "68 kg",
    height: "169 cm",
    health_status: "Stable",
    symptoms: "No major symptoms",
    diagnosis: "High Cholesterol",
    notes: "Routine health check required",
    recorded_by: "Nurse Sarah",
  },
];

const emptyRecord = {
  resident_id: "",
  record_date: "",
  blood_pressure: "",
  sugar: "",
  pulse: "",
  oxygen: "",
  temperature: "",
  weight: "",
  height: "",
  health_status: "Stable",
  symptoms: "",
  diagnosis: "",
  notes: "",
  recorded_by: "",
};

function getResidentName(id) {
  const resident = residents.find(
    (item) => item.resident_id === Number(id)
  );

  return resident ? resident.name : "Unknown Resident";
}

function formatDateTime(date) {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function HealthRecords() {
  const [records, setRecords] = useState(initialRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState(emptyRecord);

  const filteredRecords = records.filter((record) =>
    getResidentName(record.resident_id)
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewRecord({
      ...newRecord,
      [name]: value,
    });
  };

  const handleAddRecord = (e) => {
    e.preventDefault();

    if (
      !newRecord.resident_id ||
      !newRecord.record_date ||
      !newRecord.health_status ||
      !newRecord.recorded_by
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const record = {
      record_id: Date.now(),
      ...newRecord,
      resident_id: Number(newRecord.resident_id),
    };

    setRecords([...records, record]);
    setNewRecord(emptyRecord);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setNewRecord(emptyRecord);
    setShowAddForm(false);
  };

  if (selectedRecord) {
    return (
      <div className="healthRecords">
        <div className="healthProfileHeader">
          <button
            className="healthBackBtn"
            onClick={() => setSelectedRecord(null)}
          >
            ← Back to Health Records
          </button>

          <h2>Health Record</h2>
          <p>{getResidentName(selectedRecord.resident_id)}</p>
        </div>

        <div className="healthRecordProfile">
          <div className="recordTop">
            <div>
              <span>Resident</span>
              <strong>{getResidentName(selectedRecord.resident_id)}</strong>
            </div>

            <div>
              <span>Record Date</span>
              <strong>{formatDateTime(selectedRecord.record_date)}</strong>
            </div>

            <div>
              <span>Recorded By</span>
              <strong>{selectedRecord.recorded_by}</strong>
            </div>

            <div>
              <span>Health Status</span>
              <strong
                className={
                  selectedRecord.health_status === "Stable"
                    ? "recordStable"
                    : "recordAttention"
                }
              >
                {selectedRecord.health_status}
              </strong>
            </div>
          </div>

          <div className="healthRecordSection">
            <h3>Vital Signs</h3>

            <div className="vitalsGrid">
              <div className="vitalCard">
                <span>Blood Pressure</span>
                <strong>{selectedRecord.blood_pressure || "—"}</strong>
              </div>

              <div className="vitalCard">
                <span>Blood Sugar</span>
                <strong>{selectedRecord.sugar || "—"}</strong>
              </div>

              <div className="vitalCard">
                <span>Pulse</span>
                <strong>{selectedRecord.pulse || "—"}</strong>
              </div>

              <div className="vitalCard">
                <span>Oxygen</span>
                <strong>{selectedRecord.oxygen || "—"}</strong>
              </div>

              <div className="vitalCard">
                <span>Temperature</span>
                <strong>{selectedRecord.temperature || "—"}</strong>
              </div>

              <div className="vitalCard">
                <span>Weight</span>
                <strong>{selectedRecord.weight || "—"}</strong>
              </div>

              <div className="vitalCard">
                <span>Height</span>
                <strong>{selectedRecord.height || "—"}</strong>
              </div>
            </div>
          </div>

          <div className="healthRecordSection">
            <h3>Medical Information</h3>

            <div className="medicalGrid">
              <div>
                <span>Symptoms</span>
                <strong>{selectedRecord.symptoms || "—"}</strong>
              </div>

              <div>
                <span>Diagnosis</span>
                <strong>{selectedRecord.diagnosis || "—"}</strong>
              </div>

              <div className="fullMedicalInfo">
                <span>Notes</span>
                <strong>{selectedRecord.notes || "—"}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div className="healthRecords">
        <div className="healthPageHeader">
          <button className="healthBackBtn" onClick={handleCancel}>
            ← Back to Health Records
          </button>

          <h2>Add Health Record</h2>
          <p>Enter the resident's latest health information</p>
        </div>

        <form className="addHealthForm" onSubmit={handleAddRecord}>
          <div className="healthFormGrid">
            <div className="healthFormGroup">
              <label>
                Resident <span>*</span>
              </label>

              <select
                name="resident_id"
                value={newRecord.resident_id}
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

            <div className="healthFormGroup">
              <label>
                Record Date & Time <span>*</span>
              </label>

              <input
                type="datetime-local"
                name="record_date"
                value={newRecord.record_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="healthFormGroup">
              <label>Blood Pressure</label>

              <input
                type="text"
                name="blood_pressure"
                value={newRecord.blood_pressure}
                onChange={handleInputChange}
                placeholder="e.g. 128/82"
              />
            </div>

            <div className="healthFormGroup">
              <label>Blood Sugar</label>

              <input
                type="text"
                name="sugar"
                value={newRecord.sugar}
                onChange={handleInputChange}
                placeholder="e.g. 105 mg/dL"
              />
            </div>

            <div className="healthFormGroup">
              <label>Pulse</label>

              <input
                type="text"
                name="pulse"
                value={newRecord.pulse}
                onChange={handleInputChange}
                placeholder="e.g. 76 bpm"
              />
            </div>

            <div className="healthFormGroup">
              <label>Oxygen</label>

              <input
                type="text"
                name="oxygen"
                value={newRecord.oxygen}
                onChange={handleInputChange}
                placeholder="e.g. 98%"
              />
            </div>

            <div className="healthFormGroup">
              <label>Temperature</label>

              <input
                type="text"
                name="temperature"
                value={newRecord.temperature}
                onChange={handleInputChange}
                placeholder="e.g. 36.6°C"
              />
            </div>

            <div className="healthFormGroup">
              <label>Weight</label>

              <input
                type="text"
                name="weight"
                value={newRecord.weight}
                onChange={handleInputChange}
                placeholder="e.g. 62 kg"
              />
            </div>

            <div className="healthFormGroup">
              <label>Height</label>

              <input
                type="text"
                name="height"
                value={newRecord.height}
                onChange={handleInputChange}
                placeholder="e.g. 158 cm"
              />
            </div>

            <div className="healthFormGroup">
              <label>
                Health Status <span>*</span>
              </label>

              <select
                name="health_status"
                value={newRecord.health_status}
                onChange={handleInputChange}
              >
                <option value="Stable">Stable</option>
                <option value="Needs Attention">Needs Attention</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="healthFormGroup">
              <label>Recorded By</label>

              <select
                name="recorded_by"
                value={newRecord.recorded_by}
                onChange={handleInputChange}
              >
                <option value="">Select staff</option>
                <option value="Nurse Maria">Nurse Maria</option>
                <option value="Nurse Sarah">Nurse Sarah</option>
                <option value="Nurse Aisha">Nurse Aisha</option>
                <option value="Nurse John">Nurse John</option>
                <option value="Dr. Rahul Mehta">Dr. Rahul Mehta</option>
              </select>
            </div>

            <div className="healthFormGroup fullWidth">
              <label>Symptoms</label>

              <textarea
                name="symptoms"
                value={newRecord.symptoms}
                onChange={handleInputChange}
                placeholder="Enter symptoms"
                rows="3"
              />
            </div>

            <div className="healthFormGroup fullWidth">
              <label>Diagnosis</label>

              <textarea
                name="diagnosis"
                value={newRecord.diagnosis}
                onChange={handleInputChange}
                placeholder="Enter diagnosis"
                rows="3"
              />
            </div>

            <div className="healthFormGroup fullWidth">
              <label>Notes</label>

              <textarea
                name="notes"
                value={newRecord.notes}
                onChange={handleInputChange}
                placeholder="Enter additional notes"
                rows="3"
              />
            </div>
          </div>

          <div className="healthFormActions">
            <button
              type="button"
              className="healthCancelBtn"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button type="submit" className="healthSaveBtn">
              Add Health Record
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="healthRecords">
      <div className="healthPageHeader">
        <div>
          <h2>Health Records</h2>
          <p>Monitor and manage resident health information</p>
        </div>

        <button
          className="addHealthBtn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Health Record
        </button>
      </div>

      <div className="healthSearch">
        <input
          type="text"
          placeholder="Search resident..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="healthTable">
        <table>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Date</th>
              <th>Blood Pressure</th>
              <th>Sugar</th>
              <th>Pulse</th>
              <th>Oxygen</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr key={record.record_id}>
                  <td>{getResidentName(record.resident_id)}</td>
                  <td>{formatDateTime(record.record_date)}</td>
                  <td>{record.blood_pressure || "—"}</td>
                  <td>{record.sugar || "—"}</td>
                  <td>{record.pulse || "—"}</td>
                  <td>{record.oxygen || "—"}</td>

                  <td>
                    <span
                      className={
                        record.health_status === "Stable"
                          ? "healthStatus healthStableStatus"
                          : "healthStatus healthAttentionStatus"
                      }
                    >
                      {record.health_status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="healthViewBtn"
                      onClick={() => setSelectedRecord(record)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="noHealthRecords">
                  No health records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HealthRecords;