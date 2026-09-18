import { useState } from "react";
import "./Staff.css";

const initialStaff = [
  {
    staff_id: 1,
    name: "Nurse Maria",
    role: "Nurse",
    gender: "Female",
    age: 32,
    contact: "9876543201",
    email: "maria@example.com",
    address: "Pune, Maharashtra",
    joining_date: "2023-06-15",
    shift: "Morning",
    department: "Nursing",
    qualification: "B.Sc Nursing",
    experience: "6 Years",
    status: "Active",
    profile_image: null,
  },
  {
    staff_id: 2,
    name: "Nurse Sarah",
    role: "Nurse",
    gender: "Female",
    age: 29,
    contact: "9876543202",
    email: "sarah@example.com",
    address: "Pune, Maharashtra",
    joining_date: "2024-01-10",
    shift: "Evening",
    department: "Nursing",
    qualification: "B.Sc Nursing",
    experience: "4 Years",
    status: "Active",
    profile_image: null,
  },
  {
    staff_id: 3,
    name: "Nurse Aisha",
    role: "Nurse",
    gender: "Female",
    age: 35,
    contact: "9876543203",
    email: "aisha@example.com",
    address: "Pune, Maharashtra",
    joining_date: "2022-08-20",
    shift: "Morning",
    department: "Nursing",
    qualification: "B.Sc Nursing",
    experience: "8 Years",
    status: "Active",
    profile_image: null,
  },
  {
    staff_id: 4,
    name: "Nurse John",
    role: "Nurse",
    gender: "Male",
    age: 38,
    contact: "9876543204",
    email: "john@example.com",
    address: "Pune, Maharashtra",
    joining_date: "2021-03-12",
    shift: "Night",
    department: "Nursing",
    qualification: "B.Sc Nursing",
    experience: "10 Years",
    status: "Active",
    profile_image: null,
  },
  {
    staff_id: 5,
    name: "Dr. Rahul Mehta",
    role: "Doctor",
    gender: "Male",
    age: 45,
    contact: "9876543205",
    email: "rahul@example.com",
    address: "Pune, Maharashtra",
    joining_date: "2020-07-05",
    shift: "Morning",
    department: "Medical",
    qualification: "MBBS, MD",
    experience: "15 Years",
    status: "Active",
    profile_image: null,
  },
];

const emptyStaff = {
  name: "",
  role: "",
  gender: "",
  age: "",
  contact: "",
  email: "",
  address: "",
  joining_date: "",
  shift: "",
  department: "",
  qualification: "",
  experience: "",
  status: "Active",
  profile_image: null,
  profile_image_preview: null,
};

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function Staff() {
  const [staff, setStaff] = useState(initialStaff);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState(emptyStaff);

  const filteredStaff = staff.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewStaff({
      ...newStaff,
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

    setNewStaff({
      ...newStaff,
      profile_image: file,
      profile_image_preview: preview,
    });
  };

  const handleAddStaff = (e) => {
    e.preventDefault();

    if (
      !newStaff.name ||
      !newStaff.role ||
      !newStaff.gender ||
      !newStaff.contact
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const staffMember = {
      staff_id: Date.now(),
      name: newStaff.name,
      role: newStaff.role,
      gender: newStaff.gender,
      age: newStaff.age,
      contact: newStaff.contact,
      email: newStaff.email,
      address: newStaff.address,
      joining_date: newStaff.joining_date,
      shift: newStaff.shift,
      department: newStaff.department,
      qualification: newStaff.qualification,
      experience: newStaff.experience,
      status: newStaff.status,
      profile_image: newStaff.profile_image_preview,
    };

    setStaff([...staff, staffMember]);
    setNewStaff(emptyStaff);
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    setNewStaff(emptyStaff);
    setShowAddForm(false);
  };

  if (selectedStaff) {
    return (
      <div className="staffProfile">
        <div className="staffProfileHeader">
          <button
            className="staffBackBtn"
            onClick={() => setSelectedStaff(null)}
          >
            ← Back to Staff
          </button>

          <h2>{selectedStaff.name}</h2>
        </div>

        <div className="staffProfileCard">
          <div className="staffProfileTop">
            <div className="staffProfilePhoto">
              {selectedStaff.profile_image ? (
                <img
                  src={selectedStaff.profile_image}
                  alt={selectedStaff.name}
                />
              ) : (
                selectedStaff.name.charAt(0)
              )}
            </div>

            <div className="staffBasicInfo">
              <div className="staffInfoRow">
                <div>
                  <span>Role</span>
                  <strong>{selectedStaff.role}</strong>
                </div>

                <div>
                  <span>Department</span>
                  <strong>{selectedStaff.department || "—"}</strong>
                </div>
              </div>

              <div className="staffInfoRow">
                <div>
                  <span>Age</span>
                  <strong>{selectedStaff.age || "—"} years</strong>
                </div>

                <div>
                  <span>Gender</span>
                  <strong>{selectedStaff.gender}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="staffProfileSection">
            <h3>Contact Information</h3>

            <div className="staffInfoGrid">
              <div>
                <span>Contact</span>
                <strong>{selectedStaff.contact}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{selectedStaff.email || "—"}</strong>
              </div>

              <div>
                <span>Address</span>
                <strong>{selectedStaff.address || "—"}</strong>
              </div>
            </div>
          </div>

          <div className="staffProfileSection">
            <h3>Professional Information</h3>

            <div className="staffInfoGrid">
              <div>
                <span>Qualification</span>
                <strong>{selectedStaff.qualification || "—"}</strong>
              </div>

              <div>
                <span>Experience</span>
                <strong>{selectedStaff.experience || "—"}</strong>
              </div>

              <div>
                <span>Joining Date</span>
                <strong>{formatDate(selectedStaff.joining_date)}</strong>
              </div>

              <div>
                <span>Shift</span>
                <strong>{selectedStaff.shift || "—"}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong className="staffActive">
                  {selectedStaff.status}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div className="staff">
        <div className="staffHeader">
          <button className="staffBackBtn" onClick={handleCancelAdd}>
            ← Back to Staff
          </button>

          <h2>Add Staff</h2>
          <p>Enter the details of the new staff member</p>
        </div>

        <form className="addStaffForm" onSubmit={handleAddStaff}>
          <div className="staffFormGrid">
            <div className="staffFormGroup staffImageGroup">
              <label>Profile Photo</label>

              <label className="staffImageUpload">
                {newStaff.profile_image_preview ? (
                  <img
                    src={newStaff.profile_image_preview}
                    alt="Staff preview"
                  />
                ) : (
                  <>
                    <div className="staffUploadIcon">📷</div>
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

            <div className="staffFormGroup">
              <label>
                Full Name <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={newStaff.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </div>

            <div className="staffFormGroup">
              <label>
                Role <span>*</span>
              </label>

              <select
                name="role"
                value={newStaff.role}
                onChange={handleInputChange}
              >
                <option value="">Select role</option>
                <option value="Admin">Admin</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Caregiver">Caregiver</option>
                <option value="Receptionist">Receptionist</option>
              </select>
            </div>

            <div className="staffFormGroup">
              <label>
                Gender <span>*</span>
              </label>

              <select
                name="gender"
                value={newStaff.gender}
                onChange={handleInputChange}
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="staffFormGroup">
              <label>Age</label>

              <input
                type="number"
                name="age"
                value={newStaff.age}
                onChange={handleInputChange}
                placeholder="Enter age"
              />
            </div>

            <div className="staffFormGroup">
              <label>
                Contact Number <span>*</span>
              </label>

              <input
                type="tel"
                name="contact"
                value={newStaff.contact}
                onChange={handleInputChange}
                placeholder="Enter contact number"
              />
            </div>

            <div className="staffFormGroup">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={newStaff.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
            </div>

            <div className="staffFormGroup">
              <label>Address</label>

              <textarea
                name="address"
                value={newStaff.address}
                onChange={handleInputChange}
                placeholder="Enter full address"
                rows="3"
              />
            </div>

            <div className="staffFormGroup">
              <label>Department</label>

              <select
                name="department"
                value={newStaff.department}
                onChange={handleInputChange}
              >
                <option value="">Select department</option>
                <option value="Nursing">Nursing</option>
                <option value="Medical">Medical</option>
                <option value="Caregiving">Caregiving</option>
                <option value="Administration">Administration</option>
                <option value="Reception">Reception</option>
              </select>
            </div>

            <div className="staffFormGroup">
              <label>Qualification</label>

              <input
                type="text"
                name="qualification"
                value={newStaff.qualification}
                onChange={handleInputChange}
                placeholder="e.g. B.Sc Nursing"
              />
            </div>

            <div className="staffFormGroup">
              <label>Experience</label>

              <input
                type="text"
                name="experience"
                value={newStaff.experience}
                onChange={handleInputChange}
                placeholder="e.g. 5 Years"
              />
            </div>

            <div className="staffFormGroup">
              <label>Joining Date</label>

              <input
                type="date"
                name="joining_date"
                value={newStaff.joining_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="staffFormGroup">
              <label>Shift</label>

              <select
                name="shift"
                value={newStaff.shift}
                onChange={handleInputChange}
              >
                <option value="">Select shift</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>

            <div className="staffFormGroup">
              <label>Status</label>

              <select
                name="status"
                value={newStaff.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          <div className="staffFormActions">
            <button
              type="button"
              className="staffCancelBtn"
              onClick={handleCancelAdd}
            >
              Cancel
            </button>

            <button type="submit" className="staffSaveBtn">
              Add Staff
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="staff">
      <div className="staffHeader">
        <div>
          <h2>Staff</h2>
          <p>Manage staff members and their professional details</p>
        </div>

        <button
          className="addStaffBtn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Staff
        </button>
      </div>

      <div className="staffSearch">
        <input
          type="text"
          placeholder="Search staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="staffTable">
        <table>
          <thead>
            <tr>
              <th>Staff</th>
              <th>Role</th>
              <th>Department</th>
              <th>Contact</th>
              <th>Shift</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStaff.length > 0 ? (
              filteredStaff.map((member) => (
                <tr key={member.staff_id}>
                  <td>
                    <div className="staffNameCell">
                      <div className="staffTablePhoto">
                        {member.profile_image ? (
                          <img
                            src={member.profile_image}
                            alt={member.name}
                          />
                        ) : (
                          member.name.charAt(0)
                        )}
                      </div>

                      <span>{member.name}</span>
                    </div>
                  </td>

                  <td>{member.role}</td>
                  <td>{member.department || "—"}</td>
                  <td>{member.contact}</td>
                  <td>{member.shift || "—"}</td>

                  <td>
                    <span
                      className={
                        member.status === "Active"
                          ? "staffStatus staffActiveStatus"
                          : "staffStatus staffInactiveStatus"
                      }
                    >
                      {member.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="staffViewBtn"
                      onClick={() => setSelectedStaff(member)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="noStaff">
                  No staff found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Staff;