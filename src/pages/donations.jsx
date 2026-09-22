import { useEffect, useState } from "react";
import "./Donations.css";

const API = "http://127.0.0.1:5000";

const emptyDonation = {
  donor_name: "",
  contact: "",
  amount: "",
  donation_type: "",
  donation_date: "",
  payment_method: "",
  reference_number: "",
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

function formatAmount(amount) {
  if (!amount || Number(amount) === 0) return "—";

  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function Donations() {
  const [donations, setDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDonation, setNewDonation] =
    useState(emptyDonation);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // LOAD DONATIONS
  const loadDonations = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API}/api/donations`
      );

      if (!response.ok) {
        throw new Error("Failed to load donations");
      }

      const data = await response.json();

      setDonations(data);
    } catch (error) {
      console.error(
        "Error loading donations:",
        error
      );

      alert(
        "Unable to load donations. Please make sure Flask is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const filteredDonations = donations.filter(
    (donation) => {
      const search =
        searchTerm.toLowerCase().trim();

      return (
        (donation.donor_name || "")
          .toLowerCase()
          .includes(search) ||
        (donation.donation_type || "")
          .toLowerCase()
          .includes(search) ||
        (donation.payment_method || "")
          .toLowerCase()
          .includes(search) ||
        (donation.reference_number || "")
          .toLowerCase()
          .includes(search) ||
        (donation.purpose || "")
          .toLowerCase()
          .includes(search)
      );
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewDonation((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ADD DONATION
  const handleAddDonation = async (e) => {
    e.preventDefault();

    if (
      !newDonation.donor_name ||
      !newDonation.donation_type ||
      !newDonation.donation_date ||
      !newDonation.purpose
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);

      const donationData = {
        donor_name: newDonation.donor_name,
        contact: newDonation.contact,
        amount: newDonation.amount
          ? Number(newDonation.amount)
          : 0,
        donation_type:
          newDonation.donation_type,
        donation_date:
          newDonation.donation_date,
        payment_method:
          newDonation.payment_method,
        reference_number:
          newDonation.reference_number,
        purpose: newDonation.purpose,
        notes: newDonation.notes,
        received: 0,
      };

      const response = await fetch(
        `${API}/api/donations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(donationData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to add donation"
        );
      }

      alert("Donation added successfully!");

      await loadDonations();

      setNewDonation(emptyDonation);
      setShowAddForm(false);
    } catch (error) {
      console.error(
        "Error adding donation:",
        error
      );

      alert(
        `Unable to add donation: ${error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setNewDonation(emptyDonation);
    setShowAddForm(false);
  };

  // TOGGLE RECEIVED
  const toggleReceived = async (donation) => {
    try {
      const newStatus = donation.received
        ? 0
        : 1;

      const response = await fetch(
        `${API}/api/donations/${donation.donation_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            received: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update donation"
        );
      }

      await loadDonations();

      // Keep details page updated if currently open
      if (
        selectedDonation &&
        selectedDonation.donation_id ===
          donation.donation_id
      ) {
        setSelectedDonation({
          ...donation,
          received: newStatus,
        });
      }
    } catch (error) {
      console.error(
        "Error updating donation:",
        error
      );

      alert(
        `Unable to update donation: ${error.message}`
      );
    }
  };

  if (loading) {
    return (
      <div className="donations">
        <div className="donationHeader">
          <h2>Donations</h2>
          <p>Loading donations...</p>
        </div>
      </div>
    );
  }

  // DONATION DETAILS
  if (selectedDonation) {
    return (
      <div className="donations">
        <div className="donationHeader">
          <button
            className="donationBackBtn"
            onClick={() =>
              setSelectedDonation(null)
            }
          >
            ← Back to Donations
          </button>

          <h2>Donation Details</h2>

          <p>
            {selectedDonation.donor_name}
          </p>
        </div>

        <div className="donationProfileCard">
          <div className="donationTitle">
            <div className="donationIcon">
              🎁
            </div>

            <div>
              <h3>
                {selectedDonation.donor_name}
              </h3>

              <span>
                {selectedDonation.donation_type}
              </span>
            </div>
          </div>

          <div className="donationInfoGrid">
            <div>
              <span>Donor Name</span>
              <strong>
                {selectedDonation.donor_name}
              </strong>
            </div>

            <div>
              <span>Contact</span>
              <strong>
                {selectedDonation.contact ||
                  "—"}
              </strong>
            </div>

            <div>
              <span>Amount</span>
              <strong>
                {formatAmount(
                  selectedDonation.amount
                )}
              </strong>
            </div>

            <div>
              <span>Donation Type</span>
              <strong>
                {selectedDonation.donation_type}
              </strong>
            </div>

            <div>
              <span>Donation Date</span>
              <strong>
                {formatDate(
                  selectedDonation.donation_date
                )}
              </strong>
            </div>

            <div>
              <span>Payment Method</span>
              <strong>
                {selectedDonation.payment_method ||
                  "—"}
              </strong>
            </div>

            <div>
              <span>Reference Number</span>
              <strong>
                {selectedDonation.reference_number ||
                  "—"}
              </strong>
            </div>
          </div>

          <div className="donationDetailSection">
            <span>Purpose</span>

            <strong>
              {selectedDonation.purpose}
            </strong>
          </div>

          <div className="donationDetailSection">
            <span>Notes</span>

            <strong>
              {selectedDonation.notes ||
                "No additional notes"}
            </strong>
          </div>

          <div className="donationReceivedBox">
            <label className="receivedCheckbox">
              <input
                type="checkbox"
                checked={Boolean(
                  selectedDonation.received
                )}
                onChange={() =>
                  toggleReceived(
                    selectedDonation
                  )
                }
              />

              <span>
                {selectedDonation.received
                  ? "Donation Received"
                  : "Mark Donation as Received"}
              </span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // ADD DONATION FORM
  if (showAddForm) {
    return (
      <div className="donations">
        <div className="donationHeader">
          <button
            className="donationBackBtn"
            onClick={handleCancel}
          >
            ← Back to Donations
          </button>

          <h2>Add Donation</h2>

          <p>Record a new donation</p>
        </div>

        <form
          className="addDonationForm"
          onSubmit={handleAddDonation}
        >
          <div className="donationFormGrid">
            <div className="donationFormGroup">
              <label>
                Donor Name <span>*</span>
              </label>

              <input
                type="text"
                name="donor_name"
                value={
                  newDonation.donor_name
                }
                onChange={
                  handleInputChange
                }
                placeholder="e.g. Aisha Foundation"
              />
            </div>

            <div className="donationFormGroup">
              <label>Contact</label>

              <input
                type="text"
                name="contact"
                value={newDonation.contact}
                onChange={
                  handleInputChange
                }
                placeholder="Phone number"
              />
            </div>

            <div className="donationFormGroup">
              <label>Amount</label>

              <input
                type="number"
                name="amount"
                min="0"
                value={newDonation.amount}
                onChange={
                  handleInputChange
                }
                placeholder="e.g. 10000"
              />
            </div>

            <div className="donationFormGroup">
              <label>
                Donation Type{" "}
                <span>*</span>
              </label>

              <select
                name="donation_type"
                value={
                  newDonation.donation_type
                }
                onChange={
                  handleInputChange
                }
              >
                <option value="">
                  Select type
                </option>

                <option value="Money">
                  Money
                </option>

                <option value="Food">
                  Food
                </option>

                <option value="Clothing">
                  Clothing
                </option>

                <option value="Medicine">
                  Medicine
                </option>

                <option value="Equipment">
                  Equipment
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="donationFormGroup">
              <label>
                Donation Date{" "}
                <span>*</span>
              </label>

              <input
                type="date"
                name="donation_date"
                value={
                  newDonation.donation_date
                }
                onChange={
                  handleInputChange
                }
              />
            </div>

            <div className="donationFormGroup">
              <label>
                Payment Method
              </label>

              <select
                name="payment_method"
                value={
                  newDonation.payment_method
                }
                onChange={
                  handleInputChange
                }
              >
                <option value="">
                  Select method
                </option>

                <option value="Cash">
                  Cash
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="Bank Transfer">
                  Bank Transfer
                </option>

                <option value="Cheque">
                  Cheque
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="donationFormGroup">
              <label>
                Reference Number
              </label>

              <input
                type="text"
                name="reference_number"
                value={
                  newDonation.reference_number
                }
                onChange={
                  handleInputChange
                }
                placeholder="e.g. DON-2026-005"
              />
            </div>

            <div className="donationFormGroup">
              <label>
                Purpose <span>*</span>
              </label>

              <input
                type="text"
                name="purpose"
                value={newDonation.purpose}
                onChange={
                  handleInputChange
                }
                placeholder="e.g. Medical care support"
              />
            </div>

            <div className="donationFormGroup fullDonationWidth">
              <label>Notes</label>

              <textarea
                name="notes"
                value={newDonation.notes}
                onChange={
                  handleInputChange
                }
                placeholder="Enter additional details"
                rows="4"
              />
            </div>
          </div>

          <div className="donationFormActions">
            <button
              type="button"
              className="donationCancelBtn"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="donationSaveBtn"
              disabled={saving}
            >
              {saving
                ? "Adding..."
                : "Add Donation"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // MAIN DONATIONS PAGE
  return (
    <div className="donations">
      <div className="donationPageHeader">
        <div>
          <h2>Donations</h2>

          <p>
            Manage donations and contributions
            received by the home
          </p>
        </div>

        <button
          className="addDonationBtn"
          onClick={() =>
            setShowAddForm(true)
          }
        >
          + Add Donation
        </button>
      </div>

      <div className="donationSearch">
        <input
          type="text"
          placeholder="Search donor, donation or reference..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      <div className="donationTable">
        <table>
          <thead>
            <tr>
              <th>Donor</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
              <th>Payment</th>
              <th>Received</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredDonations.length > 0 ? (
              filteredDonations.map(
                (donation) => (
                  <tr
                    key={
                      donation.donation_id
                    }
                  >
                    <td>
                      <div className="donorNameCell">
                        <div className="donorSmallIcon">
                          🎁
                        </div>

                        <strong>
                          {
                            donation.donor_name
                          }
                        </strong>
                      </div>
                    </td>

                    <td className="donationAmount">
                      {formatAmount(
                        donation.amount
                      )}
                    </td>

                    <td>
                      <span className="donationTypeBadge">
                        {
                          donation.donation_type
                        }
                      </span>
                    </td>

                    <td>
                      {formatDate(
                        donation.donation_date
                      )}
                    </td>

                    <td>
                      {donation.payment_method ||
                        "—"}
                    </td>

                    <td>
                      <label className="tableReceivedCheckbox">
                        <input
                          type="checkbox"
                          checked={Boolean(
                            donation.received
                          )}
                          onChange={() =>
                            toggleReceived(
                              donation
                            )
                          }
                        />

                        <span>
                          {donation.received
                            ? "Received"
                            : "Pending"}
                        </span>
                      </label>
                    </td>

                    <td>
                      <button
                        className="donationViewBtn"
                        onClick={() =>
                          setSelectedDonation(
                            donation
                          )
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="noDonations"
                >
                  No donations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Donations;