import { useEffect, useState } from "react";
import "./Medicines.css";

const API = "http://127.0.0.1:5000";

const emptyMedicine = {
  resident_id: "",
  medicine_name: "",
  dosage: "",
  frequency: "",
  time_of_day: "",
  start_date: "",
  end_date: "",
  prescribed_by: "",
  instructions: "",
  status: "Active",
};

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAdministrationDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Medicines() {
  const [residents, setResidents] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [administration, setAdministration] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState(emptyMedicine);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --------------------------------------------------
  // LOAD DATA FROM FLASK
  // --------------------------------------------------

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        residentsResponse,
        medicinesResponse,
        administrationResponse,
      ] = await Promise.all([
        fetch(`${API}/api/residents`),
        fetch(`${API}/api/medicines`),
        fetch(`${API}/api/medicine-administration`),
      ]);

      if (!residentsResponse.ok) {
        throw new Error("Could not load residents.");
      }

      if (!medicinesResponse.ok) {
        throw new Error("Could not load medicines.");
      }

      if (!administrationResponse.ok) {
        throw new Error("Could not load administration records.");
      }

      const residentsData = await residentsResponse.json();
      const medicinesData = await medicinesResponse.json();
      const administrationData = await administrationResponse.json();

      setResidents(residentsData);
      setMedicines(medicinesData);
      setAdministration(administrationData);
    } catch (error) {
      console.error("Error loading medicine data:", error);
      alert("Could not load medicine data from the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --------------------------------------------------
  // RESIDENT NAME
  // --------------------------------------------------

  const getResidentName = (id) => {
    const resident = residents.find(
      (item) => Number(item.resident_id) === Number(id)
    );

    return resident ? resident.name : "Unknown Resident";
  };

  // --------------------------------------------------
  // FORM INPUT
  // --------------------------------------------------

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewMedicine((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // ADD MEDICINE TO DATABASE
  // --------------------------------------------------

  const handleAddMedicine = async (e) => {
    e.preventDefault();

    if (
      !newMedicine.resident_id ||
      !newMedicine.medicine_name ||
      !newMedicine.dosage ||
      !newMedicine.frequency ||
      !newMedicine.start_date
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);

      const medicineData = {
        resident_id: Number(newMedicine.resident_id),
        medicine_name: newMedicine.medicine_name,
        dosage: newMedicine.dosage,
        frequency: newMedicine.frequency,
        time_of_day: newMedicine.time_of_day,
        start_date: newMedicine.start_date,
        end_date: newMedicine.end_date,
        prescribed_by: newMedicine.prescribed_by,
        instructions: newMedicine.instructions,
        status: newMedicine.status,
      };

      const response = await fetch(`${API}/api/medicines`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicineData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add medicine.");
      }

      alert("Medicine added successfully!");

      setNewMedicine(emptyMedicine);
      setShowAddForm(false);

      await loadData();
    } catch (error) {
      console.error("Error adding medicine:", error);
      alert(`Could not add medicine: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // CANCEL FORM
  // --------------------------------------------------

  const handleCancel = () => {
    setNewMedicine(emptyMedicine);
    setShowAddForm(false);
  };

  // --------------------------------------------------
  // TOGGLE MEDICINE ADMINISTRATION
  // --------------------------------------------------

  const toggleMedication = async (record) => {
    const newStatus =
      record.status === "Given" ? "Not Given" : "Given";

    const newAdministeredBy =
      newStatus === "Given" ? "Nurse Maria" : "";

    try {
      const response = await fetch(
        `${API}/api/medicine-administration/${record.administration_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            medicine_id: record.medicine_id,
            administered_date: record.administered_date,
            administered_time: record.administered_time,
            status: newStatus,
            administered_by: newAdministeredBy,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Could not update administration record."
        );
      }

      await loadData();
    } catch (error) {
      console.error("Error updating administration:", error);
      alert(`Could not update medicine status: ${error.message}`);
    }
  };

  // --------------------------------------------------
  // GET ADMINISTRATION RECORDS FOR MEDICINE
  // --------------------------------------------------

  const getMedicineAdministration = (medicineId) => {
    return administration.filter(
      (item) => Number(item.medicine_id) === Number(medicineId)
    );
  };

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredMedicines = medicines.filter((medicine) => {
    const residentName = getResidentName(medicine.resident_id);

    const search = searchTerm.toLowerCase().trim();

    return (
      residentName.toLowerCase().includes(search) ||
      (medicine.medicine_name || "")
        .toLowerCase()
        .includes(search)
    );
  });

  // --------------------------------------------------
  // MEDICINE DETAILS PAGE
  // --------------------------------------------------

  if (selectedMedicine) {
    const medicineAdministration = getMedicineAdministration(
      selectedMedicine.medicine_id
    );

    return (
      <div className="medicines">

        <div className="medicineHeader">
          <button
            className="medicineBackBtn"
            onClick={() => setSelectedMedicine(null)}
          >
            ← Back to Medicines
          </button>

          <h2>Medicine Details</h2>

          <p>
            {getResidentName(selectedMedicine.resident_id)}
          </p>
        </div>

        <div className="medicineProfileCard">

          <div className="medicineTitle">

            <div className="medicineIcon">
              💊
            </div>

            <div>
              <h3>{selectedMedicine.medicine_name}</h3>

              <span>
                {selectedMedicine.dosage}
              </span>
            </div>

          </div>

          <div className="medicineInfoGrid">

            <div>
              <span>Resident</span>

              <strong>
                {getResidentName(selectedMedicine.resident_id)}
              </strong>
            </div>

            <div>
              <span>Frequency</span>

              <strong>
                {selectedMedicine.frequency || "—"}
              </strong>
            </div>

            <div>
              <span>Time of Day</span>

              <strong>
                {selectedMedicine.time_of_day || "—"}
              </strong>
            </div>

            <div>
              <span>Prescribed By</span>

              <strong>
                {selectedMedicine.prescribed_by || "—"}
              </strong>
            </div>

            <div>
              <span>Start Date</span>

              <strong>
                {formatDate(selectedMedicine.start_date)}
              </strong>
            </div>

            <div>
              <span>End Date</span>

              <strong>
                {formatDate(selectedMedicine.end_date)}
              </strong>
            </div>

            <div>
              <span>Status</span>

              <strong className="medicineActive">
                {selectedMedicine.status || "—"}
              </strong>
            </div>

          </div>

          <div className="medicineInstructions">

            <span>Instructions</span>

            <strong>
              {selectedMedicine.instructions || "—"}
            </strong>

          </div>

          <div className="medicationAdministration">

            <div className="administrationHeader">

              <div>
                <h3>Medication Administration</h3>

                <p>
                  Record whether the medicine was given to the resident.
                </p>
              </div>

            </div>

            {medicineAdministration.length > 0 ? (

              <div className="administrationTable">

                <div className="administrationRow administrationTableHeader">
                  <span>Date</span>
                  <span>Time</span>
                  <span>Given By</span>
                  <span>Status</span>
                </div>

                {medicineAdministration.map((record) => (

                  <div
                    className="administrationRow"
                    key={record.administration_id}
                  >

                    <span>
                      {formatAdministrationDate(
                        record.administered_date
                      )}
                    </span>

                    <span>
                      {record.administered_time || "—"}
                    </span>

                    <span>
                      {record.administered_by || "Not recorded"}
                    </span>

                    <label className="medicationCheckbox">

                      <input
                        type="checkbox"
                        checked={record.status === "Given"}
                        onChange={() =>
                          toggleMedication(record)
                        }
                      />

                      <span>
                        {record.status === "Given"
                          ? "Given"
                          : "Not Given"}
                      </span>

                    </label>

                  </div>

                ))}

              </div>

            ) : (

              <div className="noAdministration">
                No administration records available.
              </div>

            )}

          </div>

        </div>

      </div>
    );
  }

  // --------------------------------------------------
  // ADD MEDICINE FORM
  // --------------------------------------------------

  if (showAddForm) {

    return (
      <div className="medicines">

        <div className="medicineHeader">

          <button
            className="medicineBackBtn"
            onClick={handleCancel}
          >
            ← Back to Medicines
          </button>

          <h2>Add Medicine</h2>

          <p>
            Enter the medicine details for a resident
          </p>

        </div>

        <form
          className="addMedicineForm"
          onSubmit={handleAddMedicine}
        >

          <div className="medicineFormGrid">

            <div className="medicineFormGroup">

              <label>
                Resident <span>*</span>
              </label>

              <select
                name="resident_id"
                value={newMedicine.resident_id}
                onChange={handleInputChange}
                required
              >

                <option value="">
                  Select resident
                </option>

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

            <div className="medicineFormGroup">

              <label>
                Medicine Name <span>*</span>
              </label>

              <input
                type="text"
                name="medicine_name"
                value={newMedicine.medicine_name}
                onChange={handleInputChange}
                placeholder="e.g. Amlodipine"
                required
              />

            </div>

            <div className="medicineFormGroup">

              <label>
                Dosage <span>*</span>
              </label>

              <input
                type="text"
                name="dosage"
                value={newMedicine.dosage}
                onChange={handleInputChange}
                placeholder="e.g. 5mg"
                required
              />

            </div>

            <div className="medicineFormGroup">

              <label>
                Frequency <span>*</span>
              </label>

              <select
                name="frequency"
                value={newMedicine.frequency}
                onChange={handleInputChange}
                required
              >

                <option value="">
                  Select frequency
                </option>

                <option value="Once Daily">
                  Once Daily
                </option>

                <option value="Twice Daily">
                  Twice Daily
                </option>

                <option value="Three Times Daily">
                  Three Times Daily
                </option>

                <option value="As Needed">
                  As Needed
                </option>

              </select>

            </div>

            <div className="medicineFormGroup">

              <label>
                Time of Day
              </label>

              <select
                name="time_of_day"
                value={newMedicine.time_of_day}
                onChange={handleInputChange}
              >

                <option value="">
                  Select time
                </option>

                <option value="Morning">
                  Morning
                </option>

                <option value="Afternoon">
                  Afternoon
                </option>

                <option value="Evening">
                  Evening
                </option>

                <option value="Night">
                  Night
                </option>

                <option value="Morning, Evening">
                  Morning, Evening
                </option>

                <option value="When Required">
                  When Required
                </option>

              </select>

            </div>

            <div className="medicineFormGroup">

              <label>
                Start Date <span>*</span>
              </label>

              <input
                type="date"
                name="start_date"
                value={newMedicine.start_date}
                onChange={handleInputChange}
                required
              />

            </div>

            <div className="medicineFormGroup">

              <label>
                End Date
              </label>

              <input
                type="date"
                name="end_date"
                value={newMedicine.end_date}
                onChange={handleInputChange}
              />

            </div>

            <div className="medicineFormGroup">

              <label>
                Prescribed By
              </label>

              <input
                type="text"
                name="prescribed_by"
                value={newMedicine.prescribed_by}
                onChange={handleInputChange}
                placeholder="e.g. Dr. Rahul Mehta"
              />

            </div>

            <div className="medicineFormGroup">

              <label>
                Status
              </label>

              <select
                name="status"
                value={newMedicine.status}
                onChange={handleInputChange}
              >

                <option value="Active">
                  Active
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Stopped">
                  Stopped
                </option>

              </select>

            </div>

            <div className="medicineFormGroup fullMedicineWidth">

              <label>
                Instructions
              </label>

              <textarea
                name="instructions"
                value={newMedicine.instructions}
                onChange={handleInputChange}
                placeholder="e.g. Take after breakfast"
                rows="3"
              />

            </div>

          </div>

          <div className="medicineFormActions">

            <button
              type="button"
              className="medicineCancelBtn"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="medicineSaveBtn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Add Medicine"}
            </button>

          </div>

        </form>

      </div>
    );
  }

  // --------------------------------------------------
  // MAIN MEDICINES PAGE
  // --------------------------------------------------

  return (
    <div className="medicines">

      <div className="medicinePageHeader">

        <div>
          <h2>Medicines</h2>

          <p>
            Manage resident medicines and prescriptions
          </p>
        </div>

        <button
          className="addMedicineBtn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Medicine
        </button>

      </div>

      <div className="medicineSearch">

        <input
          type="text"
          placeholder="Search resident or medicine..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </div>

      <div className="medicineTable">

        {loading ? (

          <div className="noMedicines">
            Loading medicines...
          </div>

        ) : (

          <table>

            <thead>

              <tr>
                <th>Resident</th>
                <th>Medicine</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Time</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredMedicines.length > 0 ? (

                filteredMedicines.map((medicine) => (

                  <tr key={medicine.medicine_id}>

                    <td>
                      {getResidentName(medicine.resident_id)}
                    </td>

                    <td>

                      <div className="medicineNameCell">

                        <div className="medicineSmallIcon">
                          💊
                        </div>

                        <span>
                          {medicine.medicine_name}
                        </span>

                      </div>

                    </td>

                    <td>
                      {medicine.dosage}
                    </td>

                    <td>
                      {medicine.frequency}
                    </td>

                    <td>
                      {medicine.time_of_day || "—"}
                    </td>

                    <td>
                      {formatDate(medicine.end_date)}
                    </td>

                    <td>

                      <span className="medicineStatus">
                        {medicine.status}
                      </span>

                    </td>

                    <td>

                      <button
                        type="button"
                        className="medicineViewBtn"
                        onClick={() =>
                          setSelectedMedicine(medicine)
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
                    className="noMedicines"
                  >
                    No medicines found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

export default Medicines;