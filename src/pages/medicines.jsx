import { useState } from "react";
import "./Medicines.css";

const residents = [
  { resident_id: 1, name: "Mrs. Ayesha Khan" },
  { resident_id: 2, name: "Mr. Ahmed Ali" },
  { resident_id: 3, name: "Mrs. Sara Begum" },
  { resident_id: 4, name: "Mr. Raj Sharma" },
];

const initialMedicines = [
  {
    medicine_id: 1,
    resident_id: 1,
    medicine_name: "Amlodipine",
    dosage: "5mg",
    frequency: "Once Daily",
    time_of_day: "Morning",
    start_date: "2026-09-01",
    end_date: "2026-12-01",
    prescribed_by: "Dr. Rahul Mehta",
    instructions: "Take after breakfast",
    status: "Active",
  },
  {
    medicine_id: 2,
    resident_id: 2,
    medicine_name: "Metformin",
    dosage: "500mg",
    frequency: "Twice Daily",
    time_of_day: "Morning, Evening",
    start_date: "2026-09-01",
    end_date: "2026-12-01",
    prescribed_by: "Dr. Rahul Mehta",
    instructions: "Take after meals",
    status: "Active",
  },
  {
    medicine_id: 3,
    resident_id: 3,
    medicine_name: "Paracetamol",
    dosage: "500mg",
    frequency: "As Needed",
    time_of_day: "When Required",
    start_date: "2026-09-05",
    end_date: "2026-10-05",
    prescribed_by: "Dr. Rahul Mehta",
    instructions: "Take only when required for pain",
    status: "Active",
  },
  {
    medicine_id: 4,
    resident_id: 4,
    medicine_name: "Atorvastatin",
    dosage: "10mg",
    frequency: "Once Daily",
    time_of_day: "Night",
    start_date: "2026-09-01",
    end_date: "2026-12-01",
    prescribed_by: "Dr. Rahul Mehta",
    instructions: "Take after dinner",
    status: "Active",
  },
];

const initialAdministration = [
  {
    administration_id: 1,
    medicine_id: 1,
    administered_date: "2026-09-18",
    administered_time: "08:00",
    status: "Given",
    administered_by: "Nurse Maria",
  },
  {
    administration_id: 2,
    medicine_id: 1,
    administered_date: "2026-09-17",
    administered_time: "08:00",
    status: "Given",
    administered_by: "Nurse Maria",
  },
  {
    administration_id: 3,
    medicine_id: 2,
    administered_date: "2026-09-18",
    administered_time: "08:00",
    status: "Given",
    administered_by: "Nurse Sarah",
  },
  {
    administration_id: 4,
    medicine_id: 2,
    administered_date: "2026-09-18",
    administered_time: "20:00",
    status: "Not Given",
    administered_by: "",
  },
];

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

function getResidentName(id) {
  const resident = residents.find(
    (item) => item.resident_id === Number(id)
  );

  return resident ? resident.name : "Unknown Resident";
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
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
  const [medicines, setMedicines] = useState(initialMedicines);
  const [administration, setAdministration] = useState(
    initialAdministration
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState(emptyMedicine);

  const filteredMedicines = medicines.filter((medicine) => {
    const residentName = getResidentName(medicine.resident_id);
    const search = searchTerm.toLowerCase().trim();

    return (
      residentName.toLowerCase().includes(search) ||
      medicine.medicine_name.toLowerCase().includes(search)
    );
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewMedicine({
      ...newMedicine,
      [name]: value,
    });
  };

  const handleAddMedicine = (e) => {
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

    const medicine = {
      medicine_id: Date.now(),
      ...newMedicine,
      resident_id: Number(newMedicine.resident_id),
    };

    setMedicines([...medicines, medicine]);
    setNewMedicine(emptyMedicine);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setNewMedicine(emptyMedicine);
    setShowAddForm(false);
  };

  const toggleMedication = (record) => {
    setAdministration((current) =>
      current.map((item) =>
        item.administration_id === record.administration_id
          ? {
              ...item,
              status: item.status === "Given" ? "Not Given" : "Given",
              administered_by:
                item.status === "Given" ? "" : "Nurse Maria",
            }
          : item
      )
    );
  };

  const getMedicineAdministration = (medicineId) => {
    return administration.filter(
      (item) => item.medicine_id === medicineId
    );
  };

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
          <p>{getResidentName(selectedMedicine.resident_id)}</p>
        </div>

        <div className="medicineProfileCard">
          <div className="medicineTitle">
            <div className="medicineIcon">💊</div>

            <div>
              <h3>{selectedMedicine.medicine_name}</h3>
              <span>{selectedMedicine.dosage}</span>
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
              <strong>{selectedMedicine.frequency}</strong>
            </div>

            <div>
              <span>Time of Day</span>
              <strong>{selectedMedicine.time_of_day || "—"}</strong>
            </div>

            <div>
              <span>Prescribed By</span>
              <strong>{selectedMedicine.prescribed_by || "—"}</strong>
            </div>

            <div>
              <span>Start Date</span>
              <strong>{formatDate(selectedMedicine.start_date)}</strong>
            </div>

            <div>
              <span>End Date</span>
              <strong>{formatDate(selectedMedicine.end_date)}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong className="medicineActive">
                {selectedMedicine.status}
              </strong>
            </div>
          </div>

          <div className="medicineInstructions">
            <span>Instructions</span>
            <strong>{selectedMedicine.instructions || "—"}</strong>
          </div>

          <div className="medicationAdministration">
            <div className="administrationHeader">
              <div>
                <h3>Medication Administration</h3>
                <p>Record whether the medicine was given to the resident.</p>
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

                    <span>{record.administered_time}</span>

                    <span>
                      {record.administered_by || "Not recorded"}
                    </span>

                    <label className="medicationCheckbox">
                      <input
                        type="checkbox"
                        checked={record.status === "Given"}
                        onChange={() => toggleMedication(record)}
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

  if (showAddForm) {
    return (
      <div className="medicines">
        <div className="medicineHeader">
          <button className="medicineBackBtn" onClick={handleCancel}>
            ← Back to Medicines
          </button>

          <h2>Add Medicine</h2>
          <p>Enter the medicine details for a resident</p>
        </div>

        <form className="addMedicineForm" onSubmit={handleAddMedicine}>
          <div className="medicineFormGrid">
            <div className="medicineFormGroup">
              <label>
                Resident <span>*</span>
              </label>

              <select
                name="resident_id"
                value={newMedicine.resident_id}
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
              >
                <option value="">Select frequency</option>
                <option value="Once Daily">Once Daily</option>
                <option value="Twice Daily">Twice Daily</option>
                <option value="Three Times Daily">
                  Three Times Daily
                </option>
                <option value="As Needed">As Needed</option>
              </select>
            </div>

            <div className="medicineFormGroup">
              <label>Time of Day</label>

              <select
                name="time_of_day"
                value={newMedicine.time_of_day}
                onChange={handleInputChange}
              >
                <option value="">Select time</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
                <option value="Morning, Evening">
                  Morning, Evening
                </option>
                <option value="When Required">When Required</option>
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
              />
            </div>

            <div className="medicineFormGroup">
              <label>End Date</label>

              <input
                type="date"
                name="end_date"
                value={newMedicine.end_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="medicineFormGroup">
              <label>Prescribed By</label>

              <select
                name="prescribed_by"
                value={newMedicine.prescribed_by}
                onChange={handleInputChange}
              >
                <option value="">Select doctor</option>
                <option value="Dr. Rahul Mehta">Dr. Rahul Mehta</option>
              </select>
            </div>

            <div className="medicineFormGroup">
              <label>Status</label>

              <select
                name="status"
                value={newMedicine.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Stopped">Stopped</option>
              </select>
            </div>

            <div className="medicineFormGroup fullMedicineWidth">
              <label>Instructions</label>

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

            <button type="submit" className="medicineSaveBtn">
              Add Medicine
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="medicines">
      <div className="medicinePageHeader">
        <div>
          <h2>Medicines</h2>
          <p>Manage resident medicines and prescriptions</p>
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
                  <td>{getResidentName(medicine.resident_id)}</td>

                  <td>
                    <div className="medicineNameCell">
                      <div className="medicineSmallIcon">💊</div>
                      <span>{medicine.medicine_name}</span>
                    </div>
                  </td>

                  <td>{medicine.dosage}</td>
                  <td>{medicine.frequency}</td>
                  <td>{medicine.time_of_day || "—"}</td>
                  <td>{formatDate(medicine.end_date)}</td>

                  <td>
                    <span className="medicineStatus">
                      {medicine.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="medicineViewBtn"
                      onClick={() => setSelectedMedicine(medicine)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="noMedicines">
                  No medicines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Medicines;