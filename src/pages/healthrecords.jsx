import { useEffect, useState } from "react";
import "./HealthRecords.css";

const API = "http://127.0.0.1:5000";

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
  const [residents, setResidents] = useState([]);
  const [records, setRecords] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newRecord, setNewRecord] = useState({
    ...emptyRecord,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // LOAD RESIDENTS + HEALTH RECORDS
  // ==========================================

  const loadData = async () => {
    try {
      setLoading(true);

      const residentsResponse = await fetch(
        `${API}/api/residents`
      );

      const recordsResponse = await fetch(
        `${API}/api/health-records`
      );

      const residentsData = await residentsResponse.json();
      const recordsData = await recordsResponse.json();

      if (!residentsResponse.ok) {
        throw new Error(
          residentsData.error || "Could not load residents."
        );
      }

      if (!recordsResponse.ok) {
        throw new Error(
          recordsData.error || "Could not load health records."
        );
      }

      setResidents(residentsData);
      setRecords(recordsData);
    } catch (error) {
      console.error("Error loading data:", error);

      alert(
        `Could not load health records: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // GET RESIDENT NAME
  // ==========================================

  const getResidentName = (id) => {
    const resident = residents.find(
      (item) =>
        Number(item.resident_id) === Number(id)
    );

    return resident
      ? resident.name
      : "Unknown Resident";
  };

  // ==========================================
  // FILTER RECORDS
  // ==========================================

  const filteredRecords = records.filter((record) =>
    getResidentName(record.resident_id)
      .toLowerCase()
      .includes(
        searchTerm.toLowerCase().trim()
      )
  );

  // ==========================================
  // HANDLE FORM INPUT
  // ==========================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewRecord((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // ADD HEALTH RECORD
  // ==========================================

  const handleAddRecord = async (e) => {
    e.preventDefault();

    if (saving) {
      return;
    }

    if (!newRecord.resident_id) {
      alert("Please select a resident.");
      return;
    }

    if (!newRecord.record_date) {
      alert("Please select the record date and time.");
      return;
    }

    if (!newRecord.recorded_by) {
      alert("Please select the staff member.");
      return;
    }

    setSaving(true);

    const recordData = {
      resident_id: Number(
        newRecord.resident_id
      ),

      record_date:
        newRecord.record_date,

      blood_pressure:
        newRecord.blood_pressure,

      sugar:
        newRecord.sugar,

      pulse:
        newRecord.pulse,

      oxygen:
        newRecord.oxygen,

      temperature:
        newRecord.temperature,

      weight:
        newRecord.weight,

      height:
        newRecord.height,

      health_status:
        newRecord.health_status,

      symptoms:
        newRecord.symptoms,

      diagnosis:
        newRecord.diagnosis,

      notes:
        newRecord.notes,

      recorded_by:
        newRecord.recorded_by,
    };

    try {
      const response = await fetch(
        `${API}/api/health-records`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(recordData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to add health record."
        );
      }

      alert(
        "Health record added successfully!"
      );

      // Reload records from database
      await loadData();

      // Clear form
      setNewRecord({
        ...emptyRecord,
      });

      // Return to records page
      setShowAddForm(false);
    } catch (error) {
      console.error(
        "Error adding health record:",
        error
      );

      alert(
        `Could not add health record: ${error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CANCEL ADD FORM
  // ==========================================

  const handleCancel = () => {
    setNewRecord({
      ...emptyRecord,
    });

    setShowAddForm(false);
  };

  // ==========================================
  // HEALTH RECORD PROFILE
  // ==========================================

  if (selectedRecord) {
    return (
      <div className="healthRecords">

        <div className="healthProfileHeader">

          <button
            type="button"
            className="healthBackBtn"
            onClick={() =>
              setSelectedRecord(null)
            }
          >
            ← Back to Health Records
          </button>

          <h2>Health Record</h2>

          <p>
            {getResidentName(
              selectedRecord.resident_id
            )}
          </p>

        </div>


        <div className="healthRecordProfile">

          <div className="recordTop">

            <div>
              <span>Resident</span>

              <strong>
                {getResidentName(
                  selectedRecord.resident_id
                )}
              </strong>
            </div>


            <div>
              <span>Record Date</span>

              <strong>
                {formatDateTime(
                  selectedRecord.record_date
                )}
              </strong>
            </div>


            <div>
              <span>Recorded By</span>

              <strong>
                {selectedRecord.recorded_by}
              </strong>
            </div>


            <div>
              <span>Health Status</span>

              <strong
                className={
                  selectedRecord.health_status ===
                  "Stable"
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

                <strong>
                  {selectedRecord.blood_pressure ||
                    "—"}
                </strong>
              </div>


              <div className="vitalCard">
                <span>Blood Sugar</span>

                <strong>
                  {selectedRecord.sugar || "—"}
                </strong>
              </div>


              <div className="vitalCard">
                <span>Pulse</span>

                <strong>
                  {selectedRecord.pulse || "—"}
                </strong>
              </div>


              <div className="vitalCard">
                <span>Oxygen</span>

                <strong>
                  {selectedRecord.oxygen || "—"}
                </strong>
              </div>


              <div className="vitalCard">
                <span>Temperature</span>

                <strong>
                  {selectedRecord.temperature ||
                    "—"}
                </strong>
              </div>


              <div className="vitalCard">
                <span>Weight</span>

                <strong>
                  {selectedRecord.weight || "—"}
                </strong>
              </div>


              <div className="vitalCard">
                <span>Height</span>

                <strong>
                  {selectedRecord.height || "—"}
                </strong>
              </div>

            </div>

          </div>


          <div className="healthRecordSection">

            <h3>Medical Information</h3>

            <div className="medicalGrid">

              <div>
                <span>Symptoms</span>

                <strong>
                  {selectedRecord.symptoms ||
                    "—"}
                </strong>
              </div>


              <div>
                <span>Diagnosis</span>

                <strong>
                  {selectedRecord.diagnosis ||
                    "—"}
                </strong>
              </div>


              <div className="fullMedicalInfo">
                <span>Notes</span>

                <strong>
                  {selectedRecord.notes || "—"}
                </strong>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }


  // ==========================================
  // ADD HEALTH RECORD FORM
  // ==========================================

  if (showAddForm) {
    return (
      <div className="healthRecords">

        <div className="healthPageHeader">

          <button
            type="button"
            className="healthBackBtn"
            onClick={handleCancel}
          >
            ← Back to Health Records
          </button>

          <h2>Add Health Record</h2>

          <p>
            Enter the resident's latest health
            information
          </p>

        </div>


        <form
          className="addHealthForm"
          onSubmit={handleAddRecord}
        >

          <div className="healthFormGrid">

            {/* RESIDENT */}

            <div className="healthFormGroup">

              <label>
                Resident <span>*</span>
              </label>

              <select
                name="resident_id"
                value={newRecord.resident_id}
                onChange={handleInputChange}
                required
              >

                <option value="">
                  Select resident
                </option>

                {residents.map((resident) => (
                  <option
                    key={resident.resident_id}
                    value={
                      resident.resident_id
                    }
                  >
                    {resident.name}
                  </option>
                ))}

              </select>

            </div>


            {/* DATE */}

            <div className="healthFormGroup">

              <label>
                Record Date & Time{" "}
                <span>*</span>
              </label>

              <input
                type="datetime-local"
                name="record_date"
                value={newRecord.record_date}
                onChange={handleInputChange}
                required
              />

            </div>


            {/* BLOOD PRESSURE */}

            <div className="healthFormGroup">

              <label>
                Blood Pressure
              </label>

              <input
                type="text"
                name="blood_pressure"
                value={
                  newRecord.blood_pressure
                }
                onChange={handleInputChange}
                placeholder="e.g. 128/82"
              />

            </div>


            {/* SUGAR */}

            <div className="healthFormGroup">

              <label>
                Blood Sugar
              </label>

              <input
                type="text"
                name="sugar"
                value={newRecord.sugar}
                onChange={handleInputChange}
                placeholder="e.g. 105 mg/dL"
              />

            </div>


            {/* PULSE */}

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


            {/* OXYGEN */}

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


            {/* TEMPERATURE */}

            <div className="healthFormGroup">

              <label>
                Temperature
              </label>

              <input
                type="text"
                name="temperature"
                value={
                  newRecord.temperature
                }
                onChange={handleInputChange}
                placeholder="e.g. 36.6°C"
              />

            </div>


            {/* WEIGHT */}

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


            {/* HEIGHT */}

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


            {/* HEALTH STATUS */}

            <div className="healthFormGroup">

              <label>
                Health Status <span>*</span>
              </label>

              <select
                name="health_status"
                value={
                  newRecord.health_status
                }
                onChange={handleInputChange}
                required
              >

                <option value="Stable">
                  Stable
                </option>

                <option value="Needs Attention">
                  Needs Attention
                </option>

                <option value="Critical">
                  Critical
                </option>

              </select>

            </div>


            {/* RECORDED BY */}

            <div className="healthFormGroup">

              <label>
                Recorded By <span>*</span>
              </label>

              <select
                name="recorded_by"
                value={
                  newRecord.recorded_by
                }
                onChange={handleInputChange}
                required
              >

                <option value="">
                  Select staff
                </option>

                <option value="Nurse Maria">
                  Nurse Maria
                </option>

                <option value="Nurse Sarah">
                  Nurse Sarah
                </option>

                <option value="Nurse Aisha">
                  Nurse Aisha
                </option>

                <option value="Nurse John">
                  Nurse John
                </option>

                <option value="Dr. Rahul Mehta">
                  Dr. Rahul Mehta
                </option>

              </select>

            </div>


            {/* SYMPTOMS */}

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


            {/* DIAGNOSIS */}

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


            {/* NOTES */}

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


          {/* FORM BUTTONS */}

          <div className="healthFormActions">

            <button
              type="button"
              className="healthCancelBtn"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="healthSaveBtn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Add Health Record"}
            </button>

          </div>

        </form>

      </div>
    );
  }


  // ==========================================
  // HEALTH RECORD LIST
  // ==========================================

  return (
    <div className="healthRecords">

      <div className="healthPageHeader">

        <div>

          <h2>Health Records</h2>

          <p>
            Monitor and manage resident health
            information
          </p>

        </div>


        <button
          type="button"
          className="addHealthBtn"
          onClick={() =>
            setShowAddForm(true)
          }
        >
          + Add Health Record
        </button>

      </div>


      {/* SEARCH */}

      <div className="healthSearch">

        <input
          type="text"
          placeholder="Search resident..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

      </div>


      {/* TABLE */}

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

            {loading ? (

              <tr>

                <td
                  colSpan="8"
                  className="noHealthRecords"
                >
                  Loading health records...
                </td>

              </tr>

            ) : filteredRecords.length > 0 ? (

              filteredRecords.map((record) => (

                <tr key={record.record_id}>

                  <td>
                    {getResidentName(
                      record.resident_id
                    )}
                  </td>

                  <td>
                    {formatDateTime(
                      record.record_date
                    )}
                  </td>

                  <td>
                    {record.blood_pressure ||
                      "—"}
                  </td>

                  <td>
                    {record.sugar || "—"}
                  </td>

                  <td>
                    {record.pulse || "—"}
                  </td>

                  <td>
                    {record.oxygen || "—"}
                  </td>

                  <td>

                    <span
                      className={
                        record.health_status ===
                        "Stable"
                          ? "healthStatus healthStableStatus"
                          : "healthStatus healthAttentionStatus"
                      }
                    >
                      {record.health_status}
                    </span>

                  </td>

                  <td>

                    <button
                      type="button"
                      className="healthViewBtn"
                      onClick={() =>
                        setSelectedRecord(record)
                      }
                    >
                      View
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="8"
                  className="noHealthRecords"
                >
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