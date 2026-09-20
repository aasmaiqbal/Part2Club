import { useEffect, useState } from "react";
import "./Settings.css";

function Settings() {
  const [profile, setProfile] = useState({
    fullName: "Aasma Iqbal",
    email: "aasma@example.com",
    role: "Administrator",
    phone: "9876543210",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [theme, setTheme] = useState(
    localStorage.getItem("part2club-theme") || "Light"
  );

  const [rememberSidebar, setRememberSidebar] = useState(
    localStorage.getItem("part2club-sidebar") !== "false"
  );

  useEffect(() => {
    if (theme === "Dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }

    localStorage.setItem("part2club-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("part2club-sidebar", rememberSidebar);
  }, [rememberSidebar]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert("Account information updated.");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      alert("Please fill in all password fields.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    alert("Password changed successfully.");

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="settings">
      <div className="settingsHeader">
        <div>
          <h2>Settings</h2>
          <p>Manage your account and application preferences</p>
        </div>
      </div>

      <div className="settingsGrid">
        <section className="settingsCard accountCard">
          <div className="settingsCardHeader">
            <div className="settingsIcon">👤</div>

            <div>
              <h3>Account Information</h3>
              <p>Manage your personal account details</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="profilePhotoSection">
              <div className="settingsAvatar">AI</div>

              <div>
                <h4>{profile.fullName}</h4>
                <p>{profile.role}</p>
                <button type="button" className="photoButton">
                  Change Photo
                </button>
              </div>
            </div>

            <div className="settingsFormGrid">
              <div className="settingsFormGroup">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="settingsFormGroup">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="settingsFormGroup">
                <label>Role</label>
                <input type="text" value={profile.role} disabled />
              </div>

              <div className="settingsFormGroup">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                />
              </div>
            </div>

            <div className="settingsActions">
              <button type="submit" className="settingsSaveButton">
                Save Changes
              </button>
            </div>
          </form>
        </section>

        <section className="settingsCard passwordCard">
          <div className="settingsCardHeader">
            <div className="settingsIcon">🔒</div>

            <div>
              <h3>Change Password</h3>
              <p>Update your account password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div className="settingsFormGroup">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
              />
            </div>

            <div className="settingsFormGroup">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
              />
            </div>

            <div className="settingsFormGroup">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
              />
            </div>

            <div className="settingsActions">
              <button type="submit" className="settingsSaveButton">
                Change Password
              </button>
            </div>
          </form>
        </section>

        <section className="settingsCard appearanceCard">
          <div className="settingsCardHeader">
            <div className="settingsIcon">🎨</div>

            <div>
              <h3>Appearance</h3>
              <p>Customize how the application looks</p>
            </div>
          </div>

        
          <div className="appearanceOption">
            <div>
              <h4>Remember Sidebar State</h4>
              <p>Keep the sidebar preference for your next visit</p>
            </div>

            <label className="settingsToggle">
              <input
                type="checkbox"
                checked={rememberSidebar}
                onChange={() => setRememberSidebar(!rememberSidebar)}
              />
              <span></span>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;