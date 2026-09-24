from flask import Flask, jsonify, request
from flask_cors import CORS
from database import get_connection, create_database

app = Flask(__name__)
CORS(app)

create_database()


# ---------------------------------------------------------
# HELPER FUNCTIONS
# ---------------------------------------------------------

def get_rows(query, params=()):
    conn = get_connection()
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def insert_record(table, fields, data):
    conn = get_connection()

    columns = ", ".join(fields)
    placeholders = ", ".join(["?"] * len(fields))
    values = [data.get(field) for field in fields]

    cursor = conn.execute(
        f"INSERT INTO {table} ({columns}) VALUES ({placeholders})",
        values
    )

    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    return new_id


def update_record(table, record_id, fields, data):
    conn = get_connection()

    assignments = ", ".join(
        f"{field} = ?" for field in fields
    )

    values = [data.get(field) for field in fields]
    values.append(record_id)

    conn.execute(
        f"UPDATE {table} SET {assignments} WHERE id = ?",
        values
    )

    conn.commit()
    conn.close()

# ---------------------------------------------------------
# HOME
# ---------------------------------------------------------

@app.route("/")
def home():
    return "Elderly Home Management Backend is Working!"


# ---------------------------------------------------------
# DASHBOARD
# ---------------------------------------------------------

@app.route("/api/dashboard", methods=["GET"])
def dashboard():

    conn = get_connection()

    residents = conn.execute(
        "SELECT COUNT(*) FROM residents"
    ).fetchone()[0]

    staff = conn.execute(
        "SELECT COUNT(*) FROM staff"
    ).fetchone()[0]

    health_alerts = conn.execute(
        "SELECT COUNT(*) FROM health_records"
    ).fetchone()[0]

    donations = conn.execute(
        "SELECT COALESCE(SUM(amount), 0) FROM donations"
    ).fetchone()[0]

    conn.close()

    return jsonify({
        "residents": residents,
        "staff": staff,
        "health_alerts": health_alerts,
        "donations": donations
    })


# =========================================================
# RESIDENTS
# =========================================================

RESIDENT_FIELDS = [
    "name",
    "date_of_birth",
    "age",
    "gender",
    "room_no",
    "contact",
    "emergency_contact",
    "address",
    "health_status",
    "blood_type",
    "staff_assigned",
    "medical_history",
    "allergies",
    "medicines",
    "diet",
    "blood_pressure",
    "sugar",
    "pulse",
    "oxygen",
    "weight",
    "height",
    "other_notes",
    "upcoming_appointment",
    "birthday",
    "profile_image"
]


@app.route("/api/residents", methods=["GET"])
def get_residents():

    data = get_rows("""
        SELECT
            id AS resident_id,
            name,
            date_of_birth,
            age,
            gender,
            room_no,
            contact,
            emergency_contact,
            address,
            health_status,
            blood_type,
            staff_assigned,
            medical_history,
            allergies,
            medicines,
            diet,
            blood_pressure,
            sugar,
            pulse,
            oxygen,
            weight,
            height,
            other_notes,
            upcoming_appointment,
            birthday,
            profile_image
        FROM residents
        ORDER BY id
    """)

    return jsonify(data)


@app.route("/api/residents", methods=["POST"])
def add_resident():

    try:
        data = request.get_json() or {}

        if not data.get("name"):
            return jsonify({
                "error": "Resident name is required"
            }), 400

        resident_id = insert_record(
            "residents",
            RESIDENT_FIELDS,
            data
        )

        return jsonify({
            "message": "Resident added successfully",
            "resident_id": resident_id
        }), 201

    except Exception as error:

        print("ADD RESIDENT ERROR:", error)

        return jsonify({
            "error": str(error)
        }), 500


@app.route("/api/residents/<int:resident_id>", methods=["PUT"])
def update_resident(resident_id):

    try:
        data = request.get_json() or {}

        update_record(
            "residents",
            resident_id,
            RESIDENT_FIELDS,
            data
        )

        return jsonify({
            "message": "Resident updated successfully"
        })

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


# =========================================================
# HEALTH RECORDS
# =========================================================

HEALTH_FIELDS = [
    "resident_id",
    "record_date",
    "blood_pressure",
    "sugar",
    "pulse",
    "oxygen",
    "temperature",
    "weight",
    "height",
    "health_status",
    "symptoms",
    "diagnosis",
    "notes",
    "recorded_by"
]


@app.route("/api/health-records", methods=["GET"])
def get_health_records():

    data = get_rows("""
        SELECT
            id AS record_id,
            resident_id,
            record_date,
            blood_pressure,
            sugar,
            pulse,
            oxygen,
            temperature,
            weight,
            height,
            health_status,
            symptoms,
            diagnosis,
            notes,
            recorded_by
        FROM health_records
        ORDER BY id DESC
    """)

    return jsonify(data)


@app.route("/api/health-records", methods=["POST"])
def add_health_record():

    try:
        data = request.get_json() or {}

        record_id = insert_record(
            "health_records",
            HEALTH_FIELDS,
            data
        )

        return jsonify({
            "message": "Health record added successfully",
            "record_id": record_id
        }), 201

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


@app.route("/api/health-records/<int:record_id>", methods=["PUT"])
def update_health_record(record_id):

    try:
        data = request.get_json() or {}

        update_record(
            "health_records",
            record_id,
            HEALTH_FIELDS,
            data
        )

        return jsonify({
            "message": "Health record updated successfully"
        })

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


# =========================================================
# MEDICINES
# =========================================================

MEDICINE_FIELDS = [
    "resident_id",
    "medicine_name",
    "dosage",
    "frequency",
    "time_of_day",
    "start_date",
    "end_date",
    "prescribed_by",
    "instructions",
    "status"
]


@app.route("/api/medicines", methods=["GET"])
def get_medicines():

    return jsonify(get_rows("""
        SELECT
            id AS medicine_id,
            resident_id,
            medicine_name,
            dosage,
            frequency,
            time_of_day,
            start_date,
            end_date,
            prescribed_by,
            instructions,
            status
        FROM medicines
        ORDER BY id DESC
    """))


@app.route("/api/medicines", methods=["POST"])
def add_medicine():

    try:
        data = request.get_json() or {}

        medicine_id = insert_record(
            "medicines",
            MEDICINE_FIELDS,
            data
        )

        return jsonify({
            "message": "Medicine added successfully",
            "medicine_id": medicine_id
        }), 201

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


@app.route("/api/medicines/<int:medicine_id>", methods=["PUT"])
def update_medicine(medicine_id):

    try:
        data = request.get_json() or {}

        update_record(
            "medicines",
            medicine_id,
            MEDICINE_FIELDS,
            data
        )

        return jsonify({
            "message": "Medicine updated successfully"
        })

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


# =========================================================
# MEDICINE ADMINISTRATION
# =========================================================

ADMIN_FIELDS = [
    "medicine_id",
    "administered_date",
    "administered_time",
    "status",
    "administered_by"
]


@app.route("/api/medicine-administration", methods=["GET"])
def get_administration():

    return jsonify(get_rows("""
        SELECT
            id AS administration_id,
            medicine_id,
            administered_date,
            administered_time,
            status,
            administered_by
        FROM medicine_administration
        ORDER BY id DESC
    """))


@app.route("/api/medicine-administration", methods=["POST"])
def add_administration():

    try:
        data = request.get_json() or {}

        administration_id = insert_record(
            "medicine_administration",
            ADMIN_FIELDS,
            data
        )

        return jsonify({
            "message": "Medicine administration saved",
            "administration_id": administration_id
        }), 201

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


@app.route("/api/medicine-administration/<int:administration_id>", methods=["PUT"])
def update_administration(administration_id):

    try:
        data = request.get_json() or {}

        update_record(
            "medicine_administration",
            administration_id,
            ADMIN_FIELDS,
            data
        )

        return jsonify({
            "message": "Administration updated successfully"
        })

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


# =========================================================
# MEALS
# =========================================================

MEAL_FIELDS = [
    "resident_id",
    "meal_date",
    "meal_type",
    "diet_type",
    "meal_time",
    "menu",
    "restrictions",
    "recorded_by",
    "given"
]


@app.route("/api/meals", methods=["GET"])
def get_meals():

    return jsonify(get_rows("""
        SELECT
            id AS meal_id,
            resident_id,
            meal_date,
            meal_type,
            diet_type,
            meal_time,
            menu,
            restrictions,
            recorded_by,
            given
        FROM meals
        ORDER BY id DESC
    """))


@app.route("/api/meals", methods=["POST"])
def add_meal():

    try:
        data = request.get_json() or {}

        meal_id = insert_record(
            "meals",
            MEAL_FIELDS,
            data
        )

        return jsonify({
            "message": "Meal added successfully",
            "meal_id": meal_id
        }), 201

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


@app.route("/api/meals/<int:meal_id>", methods=["PUT"])
def update_meal(meal_id):

    try:
        data = request.get_json() or {}

        update_record(
            "meals",
            meal_id,
            MEAL_FIELDS,
            data
        )

        return jsonify({
            "message": "Meal updated successfully"
        })

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


# =========================================================
# CHECKUPS
# =========================================================

CHECKUP_FIELDS = [
    "resident_id",
    "checkup_date",
    "checkup_time",
    "doctor",
    "checkup_type",
    "reason",
    "findings",
    "recommendations",
    "status",
    "completed"
]


@app.route("/api/checkups", methods=["GET"])
def get_checkups():

    return jsonify(get_rows("""
        SELECT
            id AS checkup_id,
            resident_id,
            checkup_date,
            checkup_time,
            doctor,
            checkup_type,
            reason,
            findings,
            recommendations,
            status,
            completed
        FROM checkups
        ORDER BY id DESC
    """))


@app.route("/api/checkups", methods=["POST"])
def add_checkup():

    try:
        data = request.get_json() or {}

        checkup_id = insert_record(
            "checkups",
            CHECKUP_FIELDS,
            data
        )

        return jsonify({
            "message": "Checkup added successfully",
            "checkup_id": checkup_id
        }), 201

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


@app.route("/api/checkups/<int:checkup_id>", methods=["PUT"])
def update_checkup(checkup_id):

    try:
        data = request.get_json() or {}

        update_record(
            "checkups",
            checkup_id,
            CHECKUP_FIELDS,
            data
        )

        return jsonify({
            "message": "Checkup updated successfully"
        })

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


# =========================================================
# ACTIVITIES
# =========================================================

ACTIVITY_FIELDS = [
    "resident_id",
    "activity_name",
    "activity_type",
    "activity_date",
    "activity_time",
    "location",
    "staff_assigned",
    "description",
    "completed"
]


@app.route("/api/activities", methods=["GET"])
def get_activities():

    return jsonify(get_rows("""
        SELECT
            id AS activity_id,
            resident_id,
            activity_name,
            activity_type,
            activity_date,
            activity_time,
            location,
            staff_assigned,
            description,
            completed
        FROM activities
        ORDER BY id DESC
    """))


@app.route("/api/activities", methods=["POST"])
def add_activity():

    try:
        data = request.get_json() or {}

        activity_id = insert_record(
            "activities",
            ACTIVITY_FIELDS,
            data
        )

        return jsonify({
            "message": "Activity added successfully",
            "activity_id": activity_id
        }), 201

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


@app.route("/api/activities/<int:activity_id>", methods=["PUT"])
def update_activity(activity_id):

    try:
        data = request.get_json() or {}

        update_record(
            "activities",
            activity_id,
            ACTIVITY_FIELDS,
            data
        )

        return jsonify({
            "message": "Activity updated successfully"
        })

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


# =========================================================
# STAFF
# =========================================================

STAFF_FIELDS = [
    "name",
    "role",
    "gender",
    "age",
    "contact",
    "email",
    "address",
    "joining_date",
    "shift",
    "department",
    "qualification",
    "experience",
    "status",
    "profile_image"
]


@app.route("/api/staff", methods=["GET"])
def get_staff():

    return jsonify(get_rows("""
        SELECT
            id AS staff_id,
            name,
            role,
            gender,
            age,
            contact,
            email,
            address,
            joining_date,
            shift,
            department,
            qualification,
            experience,
            status,
            profile_image
        FROM staff
        ORDER BY id
    """))


@app.route("/api/staff", methods=["POST"])
def add_staff():

    try:
        data = request.get_json() or {}

        staff_id = insert_record(
            "staff",
            STAFF_FIELDS,
            data
        )

        return jsonify({
            "message": "Staff added successfully",
            "staff_id": staff_id
        }), 201

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


@app.route("/api/staff/<int:staff_id>", methods=["PUT"])
def update_staff(staff_id):

    try:
        data = request.get_json() or {}

        update_record(
            "staff",
            staff_id,
            STAFF_FIELDS,
            data
        )

        return jsonify({
            "message": "Staff updated successfully"
        })

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


# =========================================================
# DONATIONS
# =========================================================

DONATION_FIELDS = [
    "donor_name",
    "contact",
    "amount",
    "donation_type",
    "donation_date",
    "payment_method",
    "reference_number",
    "purpose",
    "notes",
    "received"
]


@app.route("/api/donations", methods=["GET"])
def get_donations():

    return jsonify(get_rows("""
        SELECT
            id AS donation_id,
            donor_name,
            contact,
            amount,
            donation_type,
            donation_date,
            payment_method,
            reference_number,
            purpose,
            notes,
            received
        FROM donations
        ORDER BY id DESC
    """))


@app.route("/api/donations", methods=["POST"])
def add_donation():

    try:
        data = request.get_json() or {}

        donation_id = insert_record(
            "donations",
            DONATION_FIELDS,
            data
        )

        return jsonify({
            "message": "Donation added successfully",
            "donation_id": donation_id
        }), 201

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


@app.route("/api/donations/<int:donation_id>", methods=["PUT"])
def update_donation(donation_id):

    try:
        data = request.get_json() or {}

        update_record(
            "donations",
            donation_id,
            DONATION_FIELDS,
            data
        )

        return jsonify({
            "message": "Donation updated successfully"
        })

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


# =========================================================
# VISITORS
# =========================================================

VISITOR_FIELDS = [
    "resident_id",
    "visitor_name",
    "relationship",
    "contact",
    "visit_date",
    "check_in",
    "check_out",
    "purpose",
    "notes",
    "checked_out"
]


@app.route("/api/visitors", methods=["GET"])
def get_visitors():

    return jsonify(get_rows("""
        SELECT
            id AS visitor_id,
            resident_id,
            visitor_name,
            relationship,
            contact,
            visit_date,
            check_in,
            check_out,
            purpose,
            notes,
            checked_out
        FROM visitors
        ORDER BY id DESC
    """))


@app.route("/api/visitors", methods=["POST"])
def add_visitor():

    try:
        data = request.get_json() or {}

        visitor_id = insert_record(
            "visitors",
            VISITOR_FIELDS,
            data
        )

        return jsonify({
            "message": "Visitor added successfully",
            "visitor_id": visitor_id
        }), 201

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


@app.route("/api/visitors/<int:visitor_id>", methods=["PUT"])
def update_visitor(visitor_id):

    try:
        data = request.get_json() or {}

        update_record(
            "visitors",
            visitor_id,
            VISITOR_FIELDS,
            data
        )

        return jsonify({
            "message": "Visitor updated successfully"
        })

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500

# =========================================================
# LOGIN
# =========================================================
USERS = {
    "Admin": {
        "username": "admin",
        "password": "admin123"
    },
    "Staff": {
        "username": "staff",
        "password": "staff123"
    }
}


@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json() or {}

        role = data.get("role")
        username = data.get("username")
        password = data.get("password")

        if role not in USERS:
            return jsonify({
                "error": "Invalid role"
            }), 400

        user = USERS[role]

        if (
            username == user["username"]
            and password == user["password"]
        ):
            return jsonify({
                "message": f"{role} login successful!",
                "role": role,
                "username": username
            }), 200

        return jsonify({
            "error": "Invalid username or password"
        }), 401

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


@app.route("/api/change-password", methods=["POST"])
def change_password():
    try:
        data = request.get_json() or {}

        role = data.get("role")
        username = data.get("username")
        current_password = data.get("current_password")
        new_password = data.get("new_password")

        if role not in USERS:
            return jsonify({
                "error": "Invalid role"
            }), 400

        user = USERS[role]

        if username != user["username"]:
            return jsonify({
                "error": "Invalid username"
            }), 401

        if current_password != user["password"]:
            return jsonify({
                "error": "Current password is incorrect"
            }), 401

        if not new_password:
            return jsonify({
                "error": "New password is required"
            }), 400

        user["password"] = new_password

        return jsonify({
            "message": "Password changed successfully."
        }), 200

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500
# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )