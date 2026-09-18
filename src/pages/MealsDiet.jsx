import { useState } from "react";
import "./MealsDiet.css";

const residents = [
  { resident_id: 1, name: "Mrs. Ayesha Khan" },
  { resident_id: 2, name: "Mr. Ahmed Ali" },
  { resident_id: 3, name: "Mrs. Sara Begum" },
  { resident_id: 4, name: "Mr. Raj Sharma" },
];

const initialMeals = [
  {
    meal_id: 1,
    resident_id: 1,
    meal_date: "2026-09-18",
    meal_type: "Breakfast",
    diet_type: "Low Salt Diet",
    meal_time: "08:00",
    menu: "Oatmeal, banana and low-fat milk",
    restrictions: "Low sodium",
    recorded_by: "Nurse Maria",
    given: true,
  },
  {
    meal_id: 2,
    resident_id: 1,
    meal_date: "2026-09-18",
    meal_type: "Lunch",
    diet_type: "Low Salt Diet",
    meal_time: "13:00",
    menu: "Brown rice, dal and steamed vegetables",
    restrictions: "Low sodium",
    recorded_by: "Nurse Maria",
    given: true,
  },
  {
    meal_id: 3,
    resident_id: 1,
    meal_date: "2026-09-18",
    meal_type: "Dinner",
    diet_type: "Low Salt Diet",
    meal_time: "19:30",
    menu: "Chapati, vegetable curry and yogurt",
    restrictions: "Low sodium",
    recorded_by: "Nurse Maria",
    given: false,
  },
  {
    meal_id: 4,
    resident_id: 2,
    meal_date: "2026-09-18",
    meal_type: "Breakfast",
    diet_type: "Diabetic Diet",
    meal_time: "08:00",
    menu: "Whole wheat toast, boiled egg and fruit",
    restrictions: "Low sugar",
    recorded_by: "Nurse Sarah",
    given: true,
  },
  {
    meal_id: 5,
    resident_id: 2,
    meal_date: "2026-09-18",
    meal_type: "Lunch",
    diet_type: "Diabetic Diet",
    meal_time: "13:00",
    menu: "Brown rice, grilled vegetables and dal",
    restrictions: "Low sugar",
    recorded_by: "Nurse Sarah",
    given: true,
  },
  {
    meal_id: 6,
    resident_id: 2,
    meal_date: "2026-09-18",
    meal_type: "Dinner",
    diet_type: "Diabetic Diet",
    meal_time: "19:30",
    menu: "Chapati, vegetable curry and salad",
    restrictions: "Low sugar",
    recorded_by: "Nurse Sarah",
    given: false,
  },
  {
    meal_id: 7,
    resident_id: 3,
    meal_date: "2026-09-18",
    meal_type: "Breakfast",
    diet_type: "Balanced Diet",
    meal_time: "08:00",
    menu: "Oatmeal, fruit and milk",
    restrictions: "None",
    recorded_by: "Nurse Aisha",
    given: true,
  },
  {
    meal_id: 8,
    resident_id: 3,
    meal_date: "2026-09-18",
    meal_type: "Lunch",
    diet_type: "Balanced Diet",
    meal_time: "13:00",
    menu: "Rice, dal, vegetables and curd",
    restrictions: "None",
    recorded_by: "Nurse Aisha",
    given: true,
  },
  {
    meal_id: 9,
    resident_id: 3,
    meal_date: "2026-09-18",
    meal_type: "Dinner",
    diet_type: "Balanced Diet",
    meal_time: "19:30",
    menu: "Chapati, vegetable curry and yogurt",
    restrictions: "None",
    recorded_by: "Nurse Aisha",
    given: true,
  },
  {
    meal_id: 10,
    resident_id: 4,
    meal_date: "2026-09-18",
    meal_type: "Breakfast",
    diet_type: "Low Fat Diet",
    meal_time: "08:00",
    menu: "Whole wheat toast, boiled egg and fruit",
    restrictions: "Low fat",
    recorded_by: "Nurse John",
    given: true,
  },
  {
    meal_id: 11,
    resident_id: 4,
    meal_date: "2026-09-18",
    meal_type: "Lunch",
    diet_type: "Low Fat Diet",
    meal_time: "13:00",
    menu: "Brown rice, dal and vegetables",
    restrictions: "Low fat",
    recorded_by: "Nurse John",
    given: false,
  },
  {
    meal_id: 12,
    resident_id: 4,
    meal_date: "2026-09-18",
    meal_type: "Dinner",
    diet_type: "Low Fat Diet",
    meal_time: "19:30",
    menu: "Chapati, vegetable curry and salad",
    restrictions: "Low fat",
    recorded_by: "Nurse John",
    given: false,
  },
];

const emptyMeal = {
  resident_id: "",
  meal_date: "",
  meal_type: "",
  diet_type: "",
  meal_time: "",
  menu: "",
  restrictions: "",
  recorded_by: "",
  given: false,
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

function getMealForType(meals, type) {
  return meals.find((meal) => meal.meal_type === type);
}

function MealsDiet() {
  const [meals, setMeals] = useState(initialMeals);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMeal, setNewMeal] = useState(emptyMeal);
  const [editingMealId, setEditingMealId] = useState(null);
  const [editMeal, setEditMeal] = useState(null);

  const groupedMeals = residents
    .map((resident) => {
      const residentMeals = meals.filter(
        (meal) => meal.resident_id === resident.resident_id
      );

      const dates = [...new Set(residentMeals.map((meal) => meal.meal_date))];

      return dates.map((date) => ({
        resident_id: resident.resident_id,
        meal_date: date,
        meals: residentMeals.filter(
          (meal) => meal.meal_date === date
        ),
      }));
    })
    .flat()
    .filter((group) => {
      const residentName = getResidentName(group.resident_id);
      const groupMeals = group.meals;

      const search = searchTerm.toLowerCase().trim();

      return (
        residentName.toLowerCase().includes(search) ||
        groupMeals.some(
          (meal) =>
            meal.meal_type.toLowerCase().includes(search) ||
            meal.diet_type.toLowerCase().includes(search) ||
            meal.menu.toLowerCase().includes(search)
        )
      );
    });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewMeal({
      ...newMeal,
      [name]: value,
    });
  };

  const handleAddMeal = (e) => {
    e.preventDefault();

    if (
      !newMeal.resident_id ||
      !newMeal.meal_date ||
      !newMeal.meal_type ||
      !newMeal.diet_type ||
      !newMeal.meal_time ||
      !newMeal.menu
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const meal = {
      meal_id: Date.now(),
      ...newMeal,
      resident_id: Number(newMeal.resident_id),
    };

    setMeals([...meals, meal]);
    setNewMeal(emptyMeal);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setNewMeal(emptyMeal);
    setShowAddForm(false);
  };

  const toggleMeal = (mealId) => {
    setMeals((current) =>
      current.map((meal) =>
        meal.meal_id === mealId
          ? {
              ...meal,
              given: !meal.given,
              recorded_by: !meal.given
                ? "Nurse Maria"
                : "",
            }
          : meal
      )
    );
  };

  const startEditing = (meal) => {
    setEditingMealId(meal.meal_id);
    setEditMeal({ ...meal });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditMeal({
      ...editMeal,
      [name]: value,
    });
  };

  const saveEdit = () => {
    setMeals((current) =>
      current.map((meal) =>
        meal.meal_id === editMeal.meal_id
          ? editMeal
          : meal
      )
    );

    setEditingMealId(null);
    setEditMeal(null);
  };

  const cancelEdit = () => {
    setEditingMealId(null);
    setEditMeal(null);
  };

  if (selectedGroup) {
    const residentMeals = meals.filter(
      (meal) =>
        meal.resident_id === selectedGroup.resident_id &&
        meal.meal_date === selectedGroup.meal_date
    );

    return (
      <div className="mealsDiet">
        <div className="mealHeader">
          <button
            className="mealBackBtn"
            onClick={() => setSelectedGroup(null)}
          >
            ← Back to Meals & Diet
          </button>

          <h2>Daily Meal Chart</h2>

          <p>
            {getResidentName(selectedGroup.resident_id)} ·{" "}
            {formatDate(selectedGroup.meal_date)}
          </p>
        </div>

        <div className="dailyMealCard">
          <div className="dailyMealHeader">
            <div>
              <h3>
                {getResidentName(selectedGroup.resident_id)}
              </h3>

              <p>{formatDate(selectedGroup.meal_date)}</p>
            </div>
          </div>

          <div className="dailyMealList">
            {residentMeals.map((meal) => (
              <div className="dailyMealRow" key={meal.meal_id}>
                {editingMealId === meal.meal_id ? (
                  <div className="mealEditBox">
                    <div className="mealEditGrid">
                      <div>
                        <label>Meal Type</label>

                        <select
                          name="meal_type"
                          value={editMeal.meal_type}
                          onChange={handleEditChange}
                        >
                          <option value="Breakfast">
                            Breakfast
                          </option>

                          <option value="Lunch">Lunch</option>

                          <option value="Dinner">Dinner</option>

                          <option value="Snack">Snack</option>
                        </select>
                      </div>

                      <div>
                        <label>Diet Type</label>

                        <select
                          name="diet_type"
                          value={editMeal.diet_type}
                          onChange={handleEditChange}
                        >
                          <option value="Regular Diet">
                            Regular Diet
                          </option>

                          <option value="Balanced Diet">
                            Balanced Diet
                          </option>

                          <option value="Diabetic Diet">
                            Diabetic Diet
                          </option>

                          <option value="Low Salt Diet">
                            Low Salt Diet
                          </option>

                          <option value="Low Fat Diet">
                            Low Fat Diet
                          </option>

                          <option value="Soft Diet">
                            Soft Diet
                          </option>

                          <option value="Liquid Diet">
                            Liquid Diet
                          </option>
                        </select>
                      </div>

                      <div>
                        <label>Meal Time</label>

                        <input
                          type="time"
                          name="meal_time"
                          value={editMeal.meal_time}
                          onChange={handleEditChange}
                        />
                      </div>

                      <div className="fullMealWidth">
                        <label>Menu / Food Details</label>

                        <textarea
                          name="menu"
                          value={editMeal.menu}
                          onChange={handleEditChange}
                          rows="2"
                        />
                      </div>

                      <div className="fullMealWidth">
                        <label>Restrictions</label>

                        <textarea
                          name="restrictions"
                          value={editMeal.restrictions}
                          onChange={handleEditChange}
                          rows="2"
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
                    <div className="dailyMealIcon">
                      {meal.meal_type === "Breakfast"
                        ? "🍳"
                        : meal.meal_type === "Lunch"
                        ? "🍛"
                        : meal.meal_type === "Dinner"
                        ? "🍲"
                        : "🍎"}
                    </div>

                    <div className="dailyMealInfo">
                      <h4>{meal.meal_type}</h4>

                      <span>
                        {meal.meal_time} · {meal.diet_type}
                      </span>

                      <p>{meal.menu}</p>
                    </div>

                    <button
                      className="mealEditBtn"
                      onClick={() => startEditing(meal)}
                    >
                      ✏️ Edit
                    </button>

                    <label className="mealCheckbox">
                      <input
                        type="checkbox"
                        checked={meal.given}
                        onChange={() => toggleMeal(meal.meal_id)}
                      />

                      <span>
                        {meal.given ? "Given" : "Not Given"}
                      </span>
                    </label>
                  </>
                )}
              </div>
            ))}
          </div>

          <button
            className="addMealInsideBtn"
            onClick={() => {
              setNewMeal({
                ...emptyMeal,
                resident_id: selectedGroup.resident_id,
                meal_date: selectedGroup.meal_date,
              });

              setSelectedGroup(null);
              setShowAddForm(true);
            }}
          >
            + Add Another Meal
          </button>
        </div>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div className="mealsDiet">
        <div className="mealHeader">
          <button className="mealBackBtn" onClick={handleCancel}>
            ← Back to Meals & Diet
          </button>

          <h2>Add Meal & Diet Record</h2>

          <p>Add a meal for a resident</p>
        </div>

        <form className="addMealForm" onSubmit={handleAddMeal}>
          <div className="mealFormGrid">
            <div className="mealFormGroup">
              <label>
                Resident <span>*</span>
              </label>

              <select
                name="resident_id"
                value={newMeal.resident_id}
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

            <div className="mealFormGroup">
              <label>
                Meal Date <span>*</span>
              </label>

              <input
                type="date"
                name="meal_date"
                value={newMeal.meal_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="mealFormGroup">
              <label>
                Meal Type <span>*</span>
              </label>

              <select
                name="meal_type"
                value={newMeal.meal_type}
                onChange={handleInputChange}
              >
                <option value="">Select meal type</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>

            <div className="mealFormGroup">
              <label>
                Diet Type <span>*</span>
              </label>

              <select
                name="diet_type"
                value={newMeal.diet_type}
                onChange={handleInputChange}
              >
                <option value="">Select diet type</option>
                <option value="Regular Diet">Regular Diet</option>
                <option value="Balanced Diet">Balanced Diet</option>
                <option value="Diabetic Diet">Diabetic Diet</option>
                <option value="Low Salt Diet">Low Salt Diet</option>
                <option value="Low Fat Diet">Low Fat Diet</option>
                <option value="Soft Diet">Soft Diet</option>
                <option value="Liquid Diet">Liquid Diet</option>
              </select>
            </div>

            <div className="mealFormGroup">
              <label>
                Meal Time <span>*</span>
              </label>

              <input
                type="time"
                name="meal_time"
                value={newMeal.meal_time}
                onChange={handleInputChange}
              />
            </div>

            <div className="mealFormGroup">
              <label>Recorded By</label>

              <select
                name="recorded_by"
                value={newMeal.recorded_by}
                onChange={handleInputChange}
              >
                <option value="">Select staff</option>
                <option value="Nurse Maria">Nurse Maria</option>
                <option value="Nurse Sarah">Nurse Sarah</option>
                <option value="Nurse Aisha">Nurse Aisha</option>
                <option value="Nurse John">Nurse John</option>
              </select>
            </div>

            <div className="mealFormGroup fullMealWidth">
              <label>
                Menu / Food Details <span>*</span>
              </label>

              <textarea
                name="menu"
                value={newMeal.menu}
                onChange={handleInputChange}
                placeholder="e.g. Oatmeal, banana and low-fat milk"
                rows="3"
              />
            </div>

            <div className="mealFormGroup fullMealWidth">
              <label>Dietary Restrictions / Allergies</label>

              <textarea
                name="restrictions"
                value={newMeal.restrictions}
                onChange={handleInputChange}
                placeholder="e.g. Low sodium, no dairy, nut allergy"
                rows="3"
              />
            </div>
          </div>

          <div className="mealFormActions">
            <button
              type="button"
              className="mealCancelBtn"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button type="submit" className="mealSaveBtn">
              Add Meal Record
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="mealsDiet">
      <div className="mealPageHeader">
        <div>
          <h2>Meals & Diet</h2>

          <p>
            Manage resident meals and dietary requirements
          </p>
        </div>

        <button
          className="addMealBtn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Meal Record
        </button>
      </div>

      <div className="mealSearch">
        <input
          type="text"
          placeholder="Search resident or diet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mealTable">
        <table>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Date</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Dinner</th>
              <th>Diet Type</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {groupedMeals.length > 0 ? (
              groupedMeals.map((group) => {
                const breakfast = getMealForType(
                  group.meals,
                  "Breakfast"
                );

                const lunch = getMealForType(
                  group.meals,
                  "Lunch"
                );

                const dinner = getMealForType(
                  group.meals,
                  "Dinner"
                );

                const dietType =
                  breakfast?.diet_type ||
                  lunch?.diet_type ||
                  dinner?.diet_type ||
                  "—";

                return (
                  <tr
                    key={`${group.resident_id}-${group.meal_date}`}
                  >
                    <td>
                      <strong>
                        {getResidentName(group.resident_id)}
                      </strong>
                    </td>

                    <td>{formatDate(group.meal_date)}</td>

                    <td>
                      <div className="tableMealCell">
                        <span className="tableMealIcon">🍳</span>

                        <div>
                          <strong>
                            {breakfast?.menu || "Not added"}
                          </strong>

                          {breakfast && (
                            <small>
                              {breakfast.meal_time}
                            </small>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="tableMealCell">
                        <span className="tableMealIcon">🍛</span>

                        <div>
                          <strong>
                            {lunch?.menu || "Not added"}
                          </strong>

                          {lunch && (
                            <small>
                              {lunch.meal_time}
                            </small>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="tableMealCell">
                        <span className="tableMealIcon">🍲</span>

                        <div>
                          <strong>
                            {dinner?.menu || "Not added"}
                          </strong>

                          {dinner && (
                            <small>
                              {dinner.meal_time}
                            </small>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="dietBadge">
                        {dietType}
                      </span>
                    </td>

                    <td>
                      <button
                        className="mealViewBtn"
                        onClick={() => setSelectedGroup(group)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="noMeals">
                  No meal records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MealsDiet;