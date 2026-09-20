import { useState } from "react";
import "./Visitors.css";

const residents = [
  { resident_id: 1, name: "Mrs. Ayesha Khan" },
  { resident_id: 2, name: "Mr. Ahmed Ali" },
  { resident_id: 3, name: "Mrs. Sara Begum" },
  { resident_id: 4, name: "Mr. Raj Sharma" },
];

const initialVisitors = [
  {
    visitor_id: 1,
    resident_id: 1,
    visitor_name: "Maria Khan",
    relationship: "Daughter",
    contact: "9876501111",
    visit_date: "2026-09-18",
    check_in: "14:00",
    check_out: "16:00",
    purpose: "Family visit",
    notes: "Regular family visit",
    checked_out: true,
  },
  {
    visitor_id: 2,
    resident_id: 1,
    visitor_name: "Ahmed Khan",
    relationship: "Son",
    contact: "9876501112",
    visit_date: "2026-09-15",
    check_in: "16:30",
    check_out: "",
    purpose: "Family visit",
    notes: "Visiting resident",
    checked_out: false,
  },
  {
    visitor_id: 3,
    resident_id: 2,
    visitor_name: "Fatima Ali",
    relationship: "Daughter",
    contact: "9876501113",
    visit_date: "2026-09-18",
    check_in: "15:00",
    check_out: "17:00",
    purpose: "Family visit",
    notes: "",
    checked_out: true,
  },
  {
    visitor_id: 4,
    resident_id: 4,
    visitor_name: "Rahul Sharma",
    relationship: "Brother",
    contact: "9876501114",
    visit_date: "2026-09-17",
    check_in: "11:00",
    check_out: "12:30",
    purpose: "Family visit",
    notes: "Short visit",
    checked_out: true,
  },
];

const emptyVisitor = {
  resident_id: "",
  visitor_name: "",
  relationship: "",
  contact: "",
  visit_date: "",
  check_in: "",
  check_out: "",
  purpose: "",
  notes: "",
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

function Visitors() {
  const [visitors, setVisitors] = useState(initialVisitors);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResident, setSelectedResident] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVisitor, setNewVisitor] = useState(emptyVisitor);
  const [editingVisitorId, setEditingVisitorId] = useState(null);
  const [editVisitor, setEditVisitor] = useState(null);

  const residentRecords = residents
    .map((resident) => {
      const residentVisitors = visitors.filter(
        (visitor) =>
          visitor.resident_id === resident.resident_id
      );

      return {
        ...resident,
        visitors: residentVisitors,
      };
    })
    .filter((resident) => {
      const search = searchTerm.toLowerCase().trim();

      return (
        resident.name.toLowerCase().includes(search) ||
        resident.visitors.some((visitor) =>
          visitor.visitor_name.toLowerCase().includes(search)
        )
      );
    });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewVisitor({
      ...newVisitor,
      [name]: value,
    });
  };

  const handleAddVisitor = (e) => {
    e.preventDefault();

    if (
      !newVisitor.resident_id ||
      !newVisitor.visitor_name ||
      !newVisitor.relationship ||
      !newVisitor.visit_date ||
      !newVisitor.check_in ||
      !newVisitor.purpose
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const visitor = {
      visitor_id: Date.now(),
      ...newVisitor,
      resident_id: Number(newVisitor.resident_id),
      checked_out: false,
    };

    setVisitors([...visitors, visitor]);
    setNewVisitor(emptyVisitor);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setNewVisitor(emptyVisitor);
    setShowAddForm(false);
  };

  const toggleCheckedOut = (visitorId) => {
    setVisitors((current) =>
      current.map((visitor) =>
        visitor.visitor_id === visitorId
          ? {
              ...visitor,
              checked_out: !visitor.checked_out,
              check_out: !visitor.checked_out
                ? visitor.check_out || "18:00"
                : "",
            }
          : visitor
      )
    );
  };

  const startEditing = (visitor) => {
    setEditingVisitorId(visitor.visitor_id);
    setEditVisitor({ ...visitor });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditVisitor({
      ...editVisitor,
      [name]: value,
    });
  };

  const saveEdit = () => {
    setVisitors((current) =>
      current.map((visitor) =>
        visitor.visitor_id === editVisitor.visitor_id
          ? editVisitor
          : visitor
      )
    );

    setEditingVisitorId(null);
    setEditVisitor(null);
  };

  const cancelEdit = () => {
    setEditingVisitorId(null);
    setEditVisitor(null);
  };

  if (selectedResident) {
    const residentVisitors = visitors.filter(
      (visitor) =>
        visitor.resident_id === selectedResident.resident_id
    );

    return (
      <div className="visitors">
        <div className="visitorHeader">
          <button
            className="visitorBackBtn"
            onClick={() => setSelectedResident(null)}
          >
            ← Back to Visitors
          </button>

          <h2>Resident Visitors</h2>

          <p>{selectedResident.name}</p>
        </div>

        <div className="residentVisitorCard">
          <div className="residentVisitorHeader">
            <div className="residentVisitorAvatar">
              {selectedResident.name.charAt(0)}
            </div>

            <div>
              <h3>{selectedResident.name}</h3>

              <p>
                {residentVisitors.length} visitor
                {residentVisitors.length !== 1 ? "s" : ""}{" "}
                recorded
              </p>
            </div>
          </div>

          <div className="residentVisitorList">
            {residentVisitors.length > 0 ? (
              residentVisitors.map((visitor) => (
                <div
                  className="residentVisitorItem"
                  key={visitor.visitor_id}
                >
                  {editingVisitorId === visitor.visitor_id ? (
                    <div className="visitorEditBox">
                      <div className="visitorEditGrid">
                        <div>
                          <label>Visitor Name</label>

                          <input
                            type="text"
                            name="visitor_name"
                            value={editVisitor.visitor_name}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div>
                          <label>Relationship</label>

                          <input
                            type="text"
                            name="relationship"
                            value={editVisitor.relationship}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div>
                          <label>Contact</label>

                          <input
                            type="text"
                            name="contact"
                            value={editVisitor.contact}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div>
                          <label>Visit Date</label>

                          <input
                            type="date"
                            name="visit_date"
                            value={editVisitor.visit_date}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div>
                          <label>Check-in</label>

                          <input
                            type="time"
                            name="check_in"
                            value={editVisitor.check_in}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div>
                          <label>Check-out</label>

                          <input
                            type="time"
                            name="check_out"
                            value={editVisitor.check_out}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div>
                          <label>Purpose</label>

                          <input
                            type="text"
                            name="purpose"
                            value={editVisitor.purpose}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div className="fullVisitorWidth">
                          <label>Notes</label>

                          <textarea
                            name="notes"
                            value={editVisitor.notes}
                            onChange={handleEditChange}
                            rows="3"
                          />
                        </div>
                      </div>

                      <div className="visitorEditActions">
                        <button
                          className="visitorEditCancelBtn"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>

                        <button
                          className="visitorEditSaveBtn"
                          onClick={saveEdit}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="residentVisitorIcon">
                        👤
                      </div>

                      <div className="residentVisitorInfo">
                        <h4>{visitor.visitor_name}</h4>

                        <span>{visitor.relationship}</span>

                        <p>
                          {formatDate(visitor.visit_date)} ·{" "}
                          {visitor.check_in}
                          {visitor.check_out
                            ? ` - ${visitor.check_out}`
                            : ""}
                        </p>

                        <small>
                          {visitor.purpose}
                          {visitor.notes
                            ? ` · ${visitor.notes}`
                            : ""}
                        </small>

                        <small>
                          Contact: {visitor.contact || "Not provided"}
                        </small>
                      </div>

                      <button
                        className="visitorEditBtn"
                        onClick={() => startEditing(visitor)}
                      >
                        ✏️ Edit
                      </button>

                      <label className="visitorCheckbox">
                        <input
                          type="checkbox"
                          checked={visitor.checked_out}
                          onChange={() =>
                            toggleCheckedOut(visitor.visitor_id)
                          }
                        />

                        <span>
                          {visitor.checked_out
                            ? "Checked Out"
                            : "Checked In"}
                        </span>
                      </label>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="noResidentVisitors">
                No visitors recorded for this resident.
              </div>
            )}
          </div>

          <button
            className="addVisitorInsideBtn"
            onClick={() => {
              setNewVisitor({
                ...emptyVisitor,
                resident_id:
                  selectedResident.resident_id,
              });

              setSelectedResident(null);
              setShowAddForm(true);
            }}
          >
            + Add Visitor for {selectedResident.name}
          </button>
        </div>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div className="visitors">
        <div className="visitorHeader">
          <button className="visitorBackBtn" onClick={handleCancel}>
            ← Back to Visitors
          </button>

          <h2>Add Visitor</h2>

          <p>Record a visitor for a resident</p>
        </div>

        <form
          className="addVisitorForm"
          onSubmit={handleAddVisitor}
        >
          <div className="visitorFormGrid">
            <div className="visitorFormGroup">
              <label>
                Resident <span>*</span>
              </label>

              <select
                name="resident_id"
                value={newVisitor.resident_id}
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

            <div className="visitorFormGroup">
              <label>
                Visitor Name <span>*</span>
              </label>

              <input
                type="text"
                name="visitor_name"
                value={newVisitor.visitor_name}
                onChange={handleInputChange}
                placeholder="e.g. Maria Khan"
              />
            </div>

            <div className="visitorFormGroup">
              <label>
                Relationship <span>*</span>
              </label>

              <input
                type="text"
                name="relationship"
                value={newVisitor.relationship}
                onChange={handleInputChange}
                placeholder="e.g. Daughter"
              />
            </div>

            <div className="visitorFormGroup">
              <label>Contact</label>

              <input
                type="text"
                name="contact"
                value={newVisitor.contact}
                onChange={handleInputChange}
                placeholder="Phone number"
              />
            </div>

            <div className="visitorFormGroup">
              <label>
                Visit Date <span>*</span>
              </label>

              <input
                type="date"
                name="visit_date"
                value={newVisitor.visit_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="visitorFormGroup">
              <label>
                Check-in Time <span>*</span>
              </label>

              <input
                type="time"
                name="check_in"
                value={newVisitor.check_in}
                onChange={handleInputChange}
              />
            </div>

            <div className="visitorFormGroup">
              <label>Check-out Time</label>

              <input
                type="time"
                name="check_out"
                value={newVisitor.check_out}
                onChange={handleInputChange}
              />
            </div>

            <div className="visitorFormGroup">
              <label>
                Purpose <span>*</span>
              </label>

              <input
                type="text"
                name="purpose"
                value={newVisitor.purpose}
                onChange={handleInputChange}
                placeholder="e.g. Family visit"
              />
            </div>

            <div className="visitorFormGroup fullVisitorWidth">
              <label>Notes</label>

              <textarea
                name="notes"
                value={newVisitor.notes}
                onChange={handleInputChange}
                placeholder="Enter additional details"
                rows="4"
              />
            </div>
          </div>

          <div className="visitorFormActions">
            <button
              type="button"
              className="visitorCancelBtn"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="visitorSaveBtn"
            >
              Add Visitor
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="visitors">
      <div className="visitorPageHeader">
        <div>
          <h2>Visitors</h2>

          <p>
            Manage resident visitors and visit records
          </p>
        </div>

        <button
          className="addVisitorBtn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Visitor
        </button>
      </div>

      <div className="visitorSearch">
        <input
          type="text"
          placeholder="Search resident or visitor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="visitorTable">
        <table>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Visitors</th>
              <th>Total</th>
              <th>Checked Out</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {residentRecords.length > 0 ? (
              residentRecords.map((resident) => {
                const checkedOutCount =
                  resident.visitors.filter(
                    (visitor) => visitor.checked_out
                  ).length;

                return (
                  <tr key={resident.resident_id}>
                    <td>
                      <strong>{resident.name}</strong>
                    </td>

                    <td>
                      {resident.visitors.length > 0 ? (
                        <div className="visitorSummary">
                          {resident.visitors
                            .slice(0, 3)
                            .map((visitor) => (
                              <span
                                key={visitor.visitor_id}
                              >
                                👤 {visitor.visitor_name}
                              </span>
                            ))}

                          {resident.visitors.length > 3 && (
                            <small>
                              +
                              {resident.visitors.length - 3}{" "}
                              more
                            </small>
                          )}
                        </div>
                      ) : (
                        <span className="noVisitorText">
                          No visitors
                        </span>
                      )}
                    </td>

                    <td>
                      <span className="visitorCount">
                        {resident.visitors.length}
                      </span>
                    </td>

                    <td>
                      <span className="checkedOutCount">
                        {checkedOutCount}/
                        {resident.visitors.length}
                      </span>
                    </td>

                    <td>
                      <button
                        className="visitorViewBtn"
                        onClick={() =>
                          setSelectedResident(resident)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="noVisitors">
                  No visitors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Visitors;