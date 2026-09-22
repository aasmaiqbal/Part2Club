import { useEffect, useState } from "react";
import "./Visitors.css";

const API = "http://127.0.0.1:5000";

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

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Visitors() {
  const [residents, setResidents] = useState([]);
  const [visitors, setVisitors] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResident, setSelectedResident] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newVisitor, setNewVisitor] =
    useState(emptyVisitor);

  const [editingVisitorId, setEditingVisitorId] =
    useState(null);

  const [editVisitor, setEditVisitor] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // LOAD RESIDENTS AND VISITORS
  const loadData = async () => {
    try {
      setLoading(true);

      const [
        residentsResponse,
        visitorsResponse,
      ] = await Promise.all([
        fetch(`${API}/api/residents`),
        fetch(`${API}/api/visitors`),
      ]);

      if (!residentsResponse.ok) {
        throw new Error("Failed to load residents");
      }

      if (!visitorsResponse.ok) {
        throw new Error("Failed to load visitors");
      }

      const residentsData =
        await residentsResponse.json();

      const visitorsData =
        await visitorsResponse.json();

      setResidents(residentsData);
      setVisitors(visitorsData);
    } catch (error) {
      console.error(
        "Error loading visitors:",
        error
      );

      alert(
        "Unable to load visitors. Please make sure Flask is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getResidentName = (id) => {
    const resident = residents.find(
      (item) =>
        item.resident_id === Number(id)
    );

    return resident
      ? resident.name
      : "Unknown Resident";
  };

  const residentRecords = residents
    .map((resident) => {
      const residentVisitors =
        visitors.filter(
          (visitor) =>
            Number(visitor.resident_id) ===
            Number(resident.resident_id)
        );

      return {
        ...resident,
        visitors: residentVisitors,
      };
    })
    .filter((resident) => {
      const search =
        searchTerm.toLowerCase().trim();

      return (
        resident.name
          .toLowerCase()
          .includes(search) ||
        resident.visitors.some(
          (visitor) =>
            (visitor.visitor_name || "")
              .toLowerCase()
              .includes(search)
        )
      );
    });

  // INPUT CHANGE
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewVisitor((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ADD VISITOR
  const handleAddVisitor = async (e) => {
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

    try {
      setSaving(true);

      const visitorData = {
        resident_id: Number(
          newVisitor.resident_id
        ),
        visitor_name:
          newVisitor.visitor_name,
        relationship:
          newVisitor.relationship,
        contact: newVisitor.contact,
        visit_date:
          newVisitor.visit_date,
        check_in:
          newVisitor.check_in,
        check_out:
          newVisitor.check_out,
        purpose:
          newVisitor.purpose,
        notes:
          newVisitor.notes,
        checked_out:
          newVisitor.check_out ? 1 : 0,
      };

      const response = await fetch(
        `${API}/api/visitors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(visitorData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to add visitor"
        );
      }

      alert("Visitor added successfully!");

      await loadData();

      setNewVisitor(emptyVisitor);
      setShowAddForm(false);
    } catch (error) {
      console.error(
        "Error adding visitor:",
        error
      );

      alert(
        `Unable to add visitor: ${error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setNewVisitor(emptyVisitor);
    setShowAddForm(false);
  };

  // TOGGLE CHECKED OUT
  const toggleCheckedOut = async (visitor) => {
    try {
      const newStatus = visitor.checked_out
        ? 0
        : 1;

      const newCheckOut =
        newStatus === 1
          ? visitor.check_out || "18:00"
          : "";

      const response = await fetch(
        `${API}/api/visitors/${visitor.visitor_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checked_out: newStatus,
            check_out: newCheckOut,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update visitor"
        );
      }

      await loadData();

      if (
        selectedResident
      ) {
        const updatedVisitor = {
          ...visitor,
          checked_out: newStatus,
          check_out: newCheckOut,
        };

        setVisitors((current) =>
          current.map((item) =>
            item.visitor_id ===
            visitor.visitor_id
              ? updatedVisitor
              : item
          )
        );
      }
    } catch (error) {
      console.error(
        "Error updating visitor:",
        error
      );

      alert(
        `Unable to update visitor: ${error.message}`
      );
    }
  };

  // START EDITING
  const startEditing = (visitor) => {
    setEditingVisitorId(
      visitor.visitor_id
    );

    setEditVisitor({
      ...visitor,
      resident_id: Number(
        visitor.resident_id
      ),
    });
  };

  // EDIT INPUT CHANGE
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditVisitor((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // SAVE EDIT
  const saveEdit = async () => {
    if (
      !editVisitor.visitor_name ||
      !editVisitor.relationship ||
      !editVisitor.visit_date ||
      !editVisitor.check_in ||
      !editVisitor.purpose
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        resident_id: Number(
          editVisitor.resident_id
        ),
        visitor_name:
          editVisitor.visitor_name,
        relationship:
          editVisitor.relationship,
        contact:
          editVisitor.contact || "",
        visit_date:
          editVisitor.visit_date,
        check_in:
          editVisitor.check_in,
        check_out:
          editVisitor.check_out || "",
        purpose:
          editVisitor.purpose,
        notes:
          editVisitor.notes || "",
        checked_out:
          editVisitor.checked_out
            ? 1
            : 0,
      };

      const response = await fetch(
        `${API}/api/visitors/${editVisitor.visitor_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update visitor"
        );
      }

      await loadData();

      setEditingVisitorId(null);
      setEditVisitor(null);
    } catch (error) {
      console.error(
        "Error saving visitor:",
        error
      );

      alert(
        `Unable to save changes: ${error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditingVisitorId(null);
    setEditVisitor(null);
  };

  if (loading) {
    return (
      <div className="visitors">
        <div className="visitorHeader">
          <h2>Visitors</h2>
          <p>Loading visitors...</p>
        </div>
      </div>
    );
  }

  // RESIDENT DETAILS
  if (selectedResident) {
    const residentVisitors =
      visitors.filter(
        (visitor) =>
          Number(visitor.resident_id) ===
          Number(
            selectedResident.resident_id
          )
      );

    return (
      <div className="visitors">
        <div className="visitorHeader">
          <button
            className="visitorBackBtn"
            onClick={() =>
              setSelectedResident(null)
            }
          >
            ← Back to Visitors
          </button>

          <h2>Resident Visitors</h2>

          <p>
            {selectedResident.name}
          </p>
        </div>

        <div className="residentVisitorCard">
          <div className="residentVisitorHeader">
            <div className="residentVisitorAvatar">
              {selectedResident.name.charAt(
                0
              )}
            </div>

            <div>
              <h3>
                {selectedResident.name}
              </h3>

              <p>
                {residentVisitors.length}{" "}
                visitor
                {residentVisitors.length !==
                1
                  ? "s"
                  : ""}{" "}
                recorded
              </p>
            </div>
          </div>

          <div className="residentVisitorList">
            {residentVisitors.length > 0 ? (
              residentVisitors.map(
                (visitor) => (
                  <div
                    className="residentVisitorItem"
                    key={
                      visitor.visitor_id
                    }
                  >
                    {editingVisitorId ===
                    visitor.visitor_id ? (
                      <div className="visitorEditBox">
                        <div className="visitorEditGrid">
                          <div>
                            <label>
                              Visitor Name
                            </label>

                            <input
                              type="text"
                              name="visitor_name"
                              value={
                                editVisitor.visitor_name ||
                                ""
                              }
                              onChange={
                                handleEditChange
                              }
                            />
                          </div>

                          <div>
                            <label>
                              Relationship
                            </label>

                            <input
                              type="text"
                              name="relationship"
                              value={
                                editVisitor.relationship ||
                                ""
                              }
                              onChange={
                                handleEditChange
                              }
                            />
                          </div>

                          <div>
                            <label>
                              Contact
                            </label>

                            <input
                              type="text"
                              name="contact"
                              value={
                                editVisitor.contact ||
                                ""
                              }
                              onChange={
                                handleEditChange
                              }
                            />
                          </div>

                          <div>
                            <label>
                              Visit Date
                            </label>

                            <input
                              type="date"
                              name="visit_date"
                              value={
                                editVisitor.visit_date ||
                                ""
                              }
                              onChange={
                                handleEditChange
                              }
                            />
                          </div>

                          <div>
                            <label>
                              Check-in
                            </label>

                            <input
                              type="time"
                              name="check_in"
                              value={
                                editVisitor.check_in ||
                                ""
                              }
                              onChange={
                                handleEditChange
                              }
                            />
                          </div>

                          <div>
                            <label>
                              Check-out
                            </label>

                            <input
                              type="time"
                              name="check_out"
                              value={
                                editVisitor.check_out ||
                                ""
                              }
                              onChange={
                                handleEditChange
                              }
                            />
                          </div>

                          <div>
                            <label>
                              Purpose
                            </label>

                            <input
                              type="text"
                              name="purpose"
                              value={
                                editVisitor.purpose ||
                                ""
                              }
                              onChange={
                                handleEditChange
                              }
                            />
                          </div>

                          <div className="fullVisitorWidth">
                            <label>
                              Notes
                            </label>

                            <textarea
                              name="notes"
                              value={
                                editVisitor.notes ||
                                ""
                              }
                              onChange={
                                handleEditChange
                              }
                              rows="3"
                            />
                          </div>
                        </div>

                        <div className="visitorEditActions">
                          <button
                            className="visitorEditCancelBtn"
                            onClick={
                              cancelEdit
                            }
                            type="button"
                          >
                            Cancel
                          </button>

                          <button
                            className="visitorEditSaveBtn"
                            onClick={
                              saveEdit
                            }
                            type="button"
                            disabled={saving}
                          >
                            {saving
                              ? "Saving..."
                              : "Save Changes"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="residentVisitorIcon">
                          👤
                        </div>

                        <div className="residentVisitorInfo">
                          <h4>
                            {
                              visitor.visitor_name
                            }
                          </h4>

                          <span>
                            {
                              visitor.relationship
                            }
                          </span>

                          <p>
                            {formatDate(
                              visitor.visit_date
                            )}{" "}
                            ·{" "}
                            {
                              visitor.check_in
                            }
                            {visitor.check_out
                              ? ` - ${visitor.check_out}`
                              : ""}
                          </p>

                          <small>
                            {
                              visitor.purpose
                            }
                            {visitor.notes
                              ? ` · ${visitor.notes}`
                              : ""}
                          </small>

                          <small>
                            Contact:{" "}
                            {visitor.contact ||
                              "Not provided"}
                          </small>
                        </div>

                        <button
                          className="visitorEditBtn"
                          onClick={() =>
                            startEditing(
                              visitor
                            )
                          }
                        >
                          ✏️ Edit
                        </button>

                        <label className="visitorCheckbox">
                          <input
                            type="checkbox"
                            checked={Boolean(
                              visitor.checked_out
                            )}
                            onChange={() =>
                              toggleCheckedOut(
                                visitor
                              )
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
                )
              )
            ) : (
              <div className="noResidentVisitors">
                No visitors recorded for
                this resident.
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
            + Add Visitor for{" "}
            {selectedResident.name}
          </button>
        </div>
      </div>
    );
  }

  // ADD VISITOR FORM
  if (showAddForm) {
    return (
      <div className="visitors">
        <div className="visitorHeader">
          <button
            className="visitorBackBtn"
            onClick={handleCancel}
          >
            ← Back to Visitors
          </button>

          <h2>Add Visitor</h2>

          <p>
            Record a visitor for a
            resident
          </p>
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
                value={
                  newVisitor.resident_id
                }
                onChange={
                  handleInputChange
                }
              >
                <option value="">
                  Select resident
                </option>

                {residents.map(
                  (resident) => (
                    <option
                      key={
                        resident.resident_id
                      }
                      value={
                        resident.resident_id
                      }
                    >
                      {resident.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="visitorFormGroup">
              <label>
                Visitor Name{" "}
                <span>*</span>
              </label>

              <input
                type="text"
                name="visitor_name"
                value={
                  newVisitor.visitor_name
                }
                onChange={
                  handleInputChange
                }
                placeholder="e.g. Maria Khan"
              />
            </div>

            <div className="visitorFormGroup">
              <label>
                Relationship{" "}
                <span>*</span>
              </label>

              <input
                type="text"
                name="relationship"
                value={
                  newVisitor.relationship
                }
                onChange={
                  handleInputChange
                }
                placeholder="e.g. Daughter"
              />
            </div>

            <div className="visitorFormGroup">
              <label>Contact</label>

              <input
                type="text"
                name="contact"
                value={
                  newVisitor.contact
                }
                onChange={
                  handleInputChange
                }
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
                value={
                  newVisitor.visit_date
                }
                onChange={
                  handleInputChange
                }
              />
            </div>

            <div className="visitorFormGroup">
              <label>
                Check-in Time{" "}
                <span>*</span>
              </label>

              <input
                type="time"
                name="check_in"
                value={
                  newVisitor.check_in
                }
                onChange={
                  handleInputChange
                }
              />
            </div>

            <div className="visitorFormGroup">
              <label>
                Check-out Time
              </label>

              <input
                type="time"
                name="check_out"
                value={
                  newVisitor.check_out
                }
                onChange={
                  handleInputChange
                }
              />
            </div>

            <div className="visitorFormGroup">
              <label>
                Purpose <span>*</span>
              </label>

              <input
                type="text"
                name="purpose"
                value={
                  newVisitor.purpose
                }
                onChange={
                  handleInputChange
                }
                placeholder="e.g. Family visit"
              />
            </div>

            <div className="visitorFormGroup fullVisitorWidth">
              <label>Notes</label>

              <textarea
                name="notes"
                value={
                  newVisitor.notes
                }
                onChange={
                  handleInputChange
                }
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
              disabled={saving}
            >
              {saving
                ? "Adding..."
                : "Add Visitor"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // MAIN VISITORS PAGE
  return (
    <div className="visitors">
      <div className="visitorPageHeader">
        <div>
          <h2>Visitors</h2>

          <p>
            Manage resident visitors and
            visit records
          </p>
        </div>

        <button
          className="addVisitorBtn"
          onClick={() =>
            setShowAddForm(true)
          }
        >
          + Add Visitor
        </button>
      </div>

      <div className="visitorSearch">
        <input
          type="text"
          placeholder="Search resident or visitor..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
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
              residentRecords.map(
                (resident) => {
                  const checkedOutCount =
                    resident.visitors.filter(
                      (visitor) =>
                        Boolean(
                          visitor.checked_out
                        )
                    ).length;

                  return (
                    <tr
                      key={
                        resident.resident_id
                      }
                    >
                      <td>
                        <strong>
                          {resident.name}
                        </strong>
                      </td>

                      <td>
                        {resident.visitors
                          .length > 0 ? (
                          <div className="visitorSummary">
                            {resident.visitors
                              .slice(0, 3)
                              .map(
                                (
                                  visitor
                                ) => (
                                  <span
                                    key={
                                      visitor.visitor_id
                                    }
                                  >
                                    👤{" "}
                                    {
                                      visitor.visitor_name
                                    }
                                  </span>
                                )
                              )}

                            {resident
                              .visitors
                              .length >
                              3 && (
                              <small>
                                +
                                {resident
                                  .visitors
                                  .length -
                                  3}{" "}
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
                          {
                            resident
                              .visitors
                              .length
                          }
                        </span>
                      </td>

                      <td>
                        <span className="checkedOutCount">
                          {
                            checkedOutCount
                          }
                          /
                          {
                            resident
                              .visitors
                              .length
                          }
                        </span>
                      </td>

                      <td>
                        <button
                          className="visitorViewBtn"
                          onClick={() =>
                            setSelectedResident(
                              resident
                            )
                          }
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                }
              )
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="noVisitors"
                >
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