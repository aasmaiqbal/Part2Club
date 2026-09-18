import { useState } from "react";
import "./Activities.css";

const residents = [
  { resident_id: 1, name: "Mrs. Ayesha Khan" },
  { resident_id: 2, name: "Mr. Ahmed Ali" },
  { resident_id: 3, name: "Mrs. Sara Begum" },
  { resident_id: 4, name: "Mr. Raj Sharma" },
];

const initialActivities = [
  {
    activity_id: 1,
    resident_id: 1,
    activity_name: "Morning Walk",
    activity_type: "Physical Activity",
    activity_date: "2026-09-18",
    activity_time: "07:30",
    location: "Garden",
    staff_assigned: "Nurse Maria",
    description: "Light morning walk around the garden.",
    completed: true,
  },
  {
    activity_id: 2,
    resident_id: 2,
    activity_name: "Music Therapy",
    activity_type: "Recreation",
    activity_date: "2026-09-18",
    activity_time: "10:00",
    location: "Activity Room",
    staff_assigned: "Nurse Sarah",
    description: "Group music and singing session.",
    completed: false,
  },
  {
    activity_id: 3,
    resident_id: 3,
    activity_name: "Yoga Session",
    activity_type: "Physical Activity",
    activity_date: "2026-09-18",
    activity_time: "09:00",
    location: "Activity Room",
    staff_assigned: "Nurse Aisha",
    description: "Gentle yoga and stretching exercises.",
    completed: true,
  },
  {
    activity_id: 4,
    resident_id: 4,
    activity_name: "Reading Club",
    activity_type: "Mental Activity",
    activity_date: "2026-09-18",
    activity_time: "16:00",
    location: "Library",
    staff_assigned: "Nurse John",
    description: "Reading and discussion of selected books.",
    completed: false,
  },
  {
    activity_id: 5,
    resident_id: 2,
    activity_name: "Jogging",
    activity_type: "Physical Activity",
    activity_date: "2026-06-07",
    activity_time: "19:12",
    location: "Garden",
    staff_assigned: "Nurse Sarah",
    description: "Light physical activity in the garden.",
    completed: false,
  },
];

const emptyActivity = {
  resident_id: "",
  activity_name: "",
  activity_type: "",
  activity_date: "",
  activity_time: "",
  location: "",
  staff_assigned: "",
  description: "",
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

function getActivityIcon(type) {
  if (type === "Physical Activity") return "🏃";
  if (type === "Recreation") return "🎵";
  if (type === "Mental Activity") return "📚";
  if (type === "Social Activity") return "👥";
  return "🎯";
}

function Activities() {
  const [activities, setActivities] = useState(initialActivities);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResident, setSelectedResident] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState(emptyActivity);
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [editActivity, setEditActivity] = useState(null);

  const residentRecords = residents
    .map((resident) => {
      const residentActivities = activities.filter(
        (activity) =>
          activity.resident_id === resident.resident_id
      );

      return {
        ...resident,
        activities: residentActivities,
      };
    })
    .filter((resident) => {
      const search = searchTerm.toLowerCase().trim();

      return (
        resident.name.toLowerCase().includes(search) ||
        resident.activities.some(
          (activity) =>
            activity.activity_name
              .toLowerCase()
              .includes(search) ||
            activity.activity_type
              .toLowerCase()
              .includes(search) ||
            activity.location
              .toLowerCase()
              .includes(search)
        )
      );
    });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewActivity({
      ...newActivity,
      [name]: value,
    });
  };

  const handleAddActivity = (e) => {
    e.preventDefault();

    if (
      !newActivity.resident_id ||
      !newActivity.activity_name ||
      !newActivity.activity_type ||
      !newActivity.activity_date ||
      !newActivity.activity_time ||
      !newActivity.location
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const activity = {
      activity_id: Date.now(),
      ...newActivity,
      resident_id: Number(newActivity.resident_id),
      completed: false,
    };

    setActivities([...activities, activity]);
    setNewActivity(emptyActivity);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setNewActivity(emptyActivity);
    setShowAddForm(false);
  };

  const toggleCompleted = (activityId) => {
    setActivities((current) =>
      current.map((activity) =>
        activity.activity_id === activityId
          ? {
              ...activity,
              completed: !activity.completed,
            }
          : activity
      )
    );
  };

  const startEditing = (activity) => {
    setEditingActivityId(activity.activity_id);
    setEditActivity({ ...activity });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditActivity({
      ...editActivity,
      [name]: value,
    });
  };

  const saveEdit = () => {
    setActivities((current) =>
      current.map((activity) =>
        activity.activity_id === editActivity.activity_id
          ? editActivity
          : activity
      )
    );

    setEditingActivityId(null);
    setEditActivity(null);
  };

  const cancelEdit = () => {
    setEditingActivityId(null);
    setEditActivity(null);
  };

  if (selectedResident) {
    const residentActivities = activities.filter(
      (activity) =>
        activity.resident_id === selectedResident.resident_id
    );

    return (
      <div className="activities">
        <div className="activityHeader">
          <button
            className="activityBackBtn"
            onClick={() => setSelectedResident(null)}
          >
            ← Back to Activities
          </button>

          <h2>Resident Activities</h2>

          <p>{selectedResident.name}</p>
        </div>

        <div className="residentActivityCard">
          <div className="residentActivityHeader">
            <div className="residentActivityAvatar">
              {selectedResident.name.charAt(0)}
            </div>

            <div>
              <h3>{selectedResident.name}</h3>

              <p>
                {residentActivities.length} activity
                {residentActivities.length !== 1 ? "ies" : "y"}{" "}
                recorded
              </p>
            </div>
          </div>

          <div className="residentActivityList">
            {residentActivities.length > 0 ? (
              residentActivities.map((activity) => (
                <div
                  className="residentActivityItem"
                  key={activity.activity_id}
                >
                  {editingActivityId === activity.activity_id ? (
                    <div className="activityEditBox">
                      <div className="activityEditGrid">
                        <div>
                          <label>Activity Name</label>

                          <input
                            type="text"
                            name="activity_name"
                            value={editActivity.activity_name}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div>
                          <label>Activity Type</label>

                          <select
                            name="activity_type"
                            value={editActivity.activity_type}
                            onChange={handleEditChange}
                          >
                            <option value="Physical Activity">
                              Physical Activity
                            </option>

                            <option value="Mental Activity">
                              Mental Activity
                            </option>

                            <option value="Recreation">
                              Recreation
                            </option>

                            <option value="Social Activity">
                              Social Activity
                            </option>

                            <option value="Religious Activity">
                              Religious Activity
                            </option>

                            <option value="Other">
                              Other
                            </option>
                          </select>
                        </div>

                        <div>
                          <label>Date</label>

                          <input
                            type="date"
                            name="activity_date"
                            value={editActivity.activity_date}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div>
                          <label>Time</label>

                          <input
                            type="time"
                            name="activity_time"
                            value={editActivity.activity_time}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div>
                          <label>Location</label>

                          <input
                            type="text"
                            name="location"
                            value={editActivity.location}
                            onChange={handleEditChange}
                          />
                        </div>

                        <div>
                          <label>Staff Assigned</label>

                          <select
                            name="staff_assigned"
                            value={editActivity.staff_assigned}
                            onChange={handleEditChange}
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
                          </select>
                        </div>

                        <div className="fullActivityWidth">
                          <label>Description</label>

                          <textarea
                            name="description"
                            value={editActivity.description}
                            onChange={handleEditChange}
                            rows="3"
                          />
                        </div>
                      </div>

                      <div className="editActions">
                        <button
                          className="editCancelBtn"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>

                        <button
                          className="editSaveBtn"
                          onClick={saveEdit}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="residentActivityIcon">
                        {getActivityIcon(
                          activity.activity_type
                        )}
                      </div>

                      <div className="residentActivityInfo">
                        <h4>{activity.activity_name}</h4>

                        <span>
                          {activity.activity_type}
                        </span>

                        <p>
                          {formatDate(activity.activity_date)} ·{" "}
                          {activity.activity_time} ·{" "}
                          {activity.location}
                        </p>

                        <small>
                          {activity.description}
                        </small>
                      </div>

                      <button
                        className="activityEditBtn"
                        onClick={() =>
                          startEditing(activity)
                        }
                      >
                        ✏️ Edit
                      </button>

                      <label className="activityCheckbox">
                        <input
                          type="checkbox"
                          checked={activity.completed}
                          onChange={() =>
                            toggleCompleted(
                              activity.activity_id
                            )
                          }
                        />

                        <span>
                          {activity.completed
                            ? "Completed"
                            : "Not Completed"}
                        </span>
                      </label>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="noResidentActivities">
                No activities recorded for this resident.
              </div>
            )}
          </div>

          <button
            className="addActivityInsideBtn"
            onClick={() => {
              setNewActivity({
                ...emptyActivity,
                resident_id:
                  selectedResident.resident_id,
              });

              setSelectedResident(null);
              setShowAddForm(true);
            }}
          >
            + Add Activity for {selectedResident.name}
          </button>
        </div>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div className="activities">
        <div className="activityHeader">
          <button className="activityBackBtn" onClick={handleCancel}>
            ← Back to Activities
          </button>

          <h2>Add Activity</h2>

          <p>Schedule an activity for a resident</p>
        </div>

        <form
          className="addActivityForm"
          onSubmit={handleAddActivity}
        >
          <div className="activityFormGrid">
            <div className="activityFormGroup">
              <label>
                Resident <span>*</span>
              </label>

              <select
                name="resident_id"
                value={newActivity.resident_id}
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

            <div className="activityFormGroup">
              <label>
                Activity Name <span>*</span>
              </label>

              <input
                type="text"
                name="activity_name"
                value={newActivity.activity_name}
                onChange={handleInputChange}
                placeholder="e.g. Morning Walk"
              />
            </div>

            <div className="activityFormGroup">
              <label>
                Activity Type <span>*</span>
              </label>

              <select
                name="activity_type"
                value={newActivity.activity_type}
                onChange={handleInputChange}
              >
                <option value="">Select activity type</option>
                <option value="Physical Activity">
                  Physical Activity
                </option>
                <option value="Mental Activity">
                  Mental Activity
                </option>
                <option value="Recreation">
                  Recreation
                </option>
                <option value="Social Activity">
                  Social Activity
                </option>
                <option value="Religious Activity">
                  Religious Activity
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="activityFormGroup">
              <label>
                Date <span>*</span>
              </label>

              <input
                type="date"
                name="activity_date"
                value={newActivity.activity_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="activityFormGroup">
              <label>
                Time <span>*</span>
              </label>

              <input
                type="time"
                name="activity_time"
                value={newActivity.activity_time}
                onChange={handleInputChange}
              />
            </div>

            <div className="activityFormGroup">
              <label>
                Location <span>*</span>
              </label>

              <input
                type="text"
                name="location"
                value={newActivity.location}
                onChange={handleInputChange}
                placeholder="e.g. Garden"
              />
            </div>

            <div className="activityFormGroup">
              <label>Staff Assigned</label>

              <select
                name="staff_assigned"
                value={newActivity.staff_assigned}
                onChange={handleInputChange}
              >
                <option value="">Select staff</option>
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
              </select>
            </div>

            <div className="activityFormGroup fullActivityWidth">
              <label>Description</label>

              <textarea
                name="description"
                value={newActivity.description}
                onChange={handleInputChange}
                placeholder="Enter activity details"
                rows="4"
              />
            </div>
          </div>

          <div className="activityFormActions">
            <button
              type="button"
              className="activityCancelBtn"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="activitySaveBtn"
            >
              Add Activity
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="activities">
      <div className="activityPageHeader">
        <div>
          <h2>Activities</h2>

          <p>
            Manage resident activities and daily programs
          </p>
        </div>

        <button
          className="addActivityBtn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Activity
        </button>
      </div>

      <div className="activitySearch">
        <input
          type="text"
          placeholder="Search resident or activity..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="activityTable">
        <table>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Activities</th>
              <th>Total</th>
              <th>Completed</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {residentRecords.length > 0 ? (
              residentRecords.map((resident) => {
                const completedCount =
                  resident.activities.filter(
                    (activity) => activity.completed
                  ).length;

                return (
                  <tr key={resident.resident_id}>
                    <td>
                      <strong>{resident.name}</strong>
                    </td>

                    <td>
                      {resident.activities.length > 0 ? (
                        <div className="activitySummary">
                          {resident.activities
                            .slice(0, 3)
                            .map((activity) => (
                              <span
                                key={activity.activity_id}
                              >
                                {getActivityIcon(
                                  activity.activity_type
                                )}{" "}
                                {activity.activity_name}
                              </span>
                            ))}

                          {resident.activities.length > 3 && (
                            <small>
                              +
                              {resident.activities.length - 3}{" "}
                              more
                            </small>
                          )}
                        </div>
                      ) : (
                        <span className="noActivityText">
                          No activities
                        </span>
                      )}
                    </td>

                    <td>
                      <span className="activityCount">
                        {resident.activities.length}
                      </span>
                    </td>

                    <td>
                      <span className="completionCount">
                        {completedCount}/
                        {resident.activities.length}
                      </span>
                    </td>

                    <td>
                      <button
                        className="activityViewBtn"
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
                <td colSpan="5" className="noActivities">
                  No activities found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Activities;