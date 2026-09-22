from database import get_connection, create_database


create_database()

conn = get_connection()
cursor = conn.cursor()


# ---------------------------------------------------------
# RESIDENTS
# ---------------------------------------------------------

residents = [
    (
        "Mrs. Ayesha Khan",
        "1954-04-12",
        72,
        "Female",
        "101",
        "9876543210",
        "9876543211",
        "Pune, Maharashtra",
        "Stable",
        "B+",
        "Nurse Maria",
        "Hypertension",
        "None",
        "Amlodipine",
        "Low Salt Diet",
        "150/95",
        "110",
        "78",
        "97",
        "62",
        "160",
        "Regular monitoring required",
        "2026-09-25",
        "1954-04-12",
        None
    ),
    (
        "Mr. Ahmed Ali",
        "1951-08-20",
        75,
        "Male",
        "102",
        "9876543212",
        "9876543213",
        "Pune, Maharashtra",
        "Stable",
        "O+",
        "Nurse Sarah",
        "Diabetes",
        "None",
        "Metformin",
        "Diabetic Diet",
        "130/85",
        "145",
        "76",
        "98",
        "68",
        "168",
        "Blood sugar monitoring required",
        "2026-09-28",
        "1951-08-20",
        None
    ),
    (
        "Mrs. Sara Begum",
        "1956-02-15",
        70,
        "Female",
        "103",
        "9876543214",
        "9876543215",
        "Pune, Maharashtra",
        "Stable",
        "A+",
        "Nurse Aisha",
        "Arthritis",
        "Penicillin",
        "Pain relief medication",
        "Balanced Diet",
        "125/80",
        "105",
        "72",
        "98",
        "60",
        "158",
        "Routine health monitoring",
        "2026-10-02",
        "1956-02-15",
        None
    ),
    (
        "Mr. Raj Sharma",
        "1950-11-10",
        75,
        "Male",
        "104",
        "9876543216",
        "9876543217",
        "Pune, Maharashtra",
        "Stable",
        "B+",
        "Nurse John",
        "High cholesterol",
        "None",
        "Atorvastatin",
        "Low Fat Diet",
        "128/82",
        "100",
        "74",
        "97",
        "70",
        "170",
        "Diet and exercise monitoring",
        "2026-10-05",
        "1950-11-10",
        None
    )
]

cursor.executemany("""
    INSERT INTO residents (
        name, date_of_birth, age, gender, room_no, contact,
        emergency_contact, address, health_status, blood_type,
        staff_assigned, medical_history, allergies, medicines,
        diet, blood_pressure, sugar, pulse, oxygen, weight,
        height, other_notes, upcoming_appointment, birthday,
        profile_image
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", residents)


# ---------------------------------------------------------
# STAFF
# ---------------------------------------------------------

staff = [
    (
        "Maria Fernandes",
        "Nurse",
        "Female",
        32,
        "9876500001",
        "maria@example.com",
        "Pune",
        "2023-06-10",
        "Morning",
        "Healthcare",
        "B.Sc Nursing",
        "6 years",
        "Active",
        None
    ),
    (
        "Sarah Thomas",
        "Nurse",
        "Female",
        35,
        "9876500002",
        "sarah@example.com",
        "Pune",
        "2022-04-15",
        "Evening",
        "Healthcare",
        "B.Sc Nursing",
        "8 years",
        "Active",
        None
    ),
    (
        "John Mathew",
        "Caregiver",
        "Male",
        29,
        "9876500003",
        "john@example.com",
        "Pune",
        "2024-01-12",
        "Morning",
        "Care",
        "Caregiving Certificate",
        "4 years",
        "Active",
        None
    )
]

cursor.executemany("""
    INSERT INTO staff (
        name, role, gender, age, contact, email, address,
        joining_date, shift, department, qualification,
        experience, status, profile_image
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", staff)


# ---------------------------------------------------------
# HEALTH RECORDS
# ---------------------------------------------------------

health_records = [
    (
        1,
        "2026-09-18",
        "150/95",
        "110",
        "78",
        "97",
        "36.7",
        "62",
        "160",
        "Needs Monitoring",
        "Mild headache",
        "Hypertension",
        "Blood pressure should be monitored regularly.",
        "Nurse Maria"
    ),
    (
        2,
        "2026-09-18",
        "130/85",
        "145",
        "76",
        "98",
        "36.6",
        "68",
        "168",
        "Stable",
        "None",
        "Diabetes",
        "Continue regular medication.",
        "Nurse Sarah"
    ),
    (
        3,
        "2026-09-18",
        "125/80",
        "105",
        "72",
        "98",
        "36.5",
        "60",
        "158",
        "Stable",
        "Joint pain",
        "Arthritis",
        "Routine checkup recommended.",
        "Nurse Aisha"
    )
]

cursor.executemany("""
    INSERT INTO health_records (
        resident_id, record_date, blood_pressure, sugar,
        pulse, oxygen, temperature, weight, height,
        health_status, symptoms, diagnosis, notes, recorded_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", health_records)


# ---------------------------------------------------------
# MEDICINES
# ---------------------------------------------------------

medicines = [
    (
        1,
        "Amlodipine",
        "5 mg",
        "Once daily",
        "08:00",
        "2026-09-01",
        "2026-10-01",
        "Dr. Mehta",
        "Take after breakfast",
        "Active"
    ),
    (
        2,
        "Metformin",
        "500 mg",
        "Twice daily",
        "08:00, 20:00",
        "2026-09-01",
        "2026-10-01",
        "Dr. Shah",
        "Take with meals",
        "Active"
    ),
    (
        4,
        "Atorvastatin",
        "10 mg",
        "Once daily",
        "21:00",
        "2026-09-01",
        "2026-10-01",
        "Dr. Patil",
        "Take at night",
        "Active"
    )
]

cursor.executemany("""
    INSERT INTO medicines (
        resident_id, medicine_name, dosage, frequency,
        time_of_day, start_date, end_date, prescribed_by,
        instructions, status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", medicines)


# ---------------------------------------------------------
# MEALS
# ---------------------------------------------------------

meals = [
    (
        1,
        "2026-09-18",
        "Breakfast",
        "Low Salt Diet",
        "08:00",
        "Oatmeal, banana and low-fat milk",
        "Low sodium",
        "Nurse Maria",
        1
    ),
    (
        1,
        "2026-09-18",
        "Lunch",
        "Low Salt Diet",
        "13:00",
        "Brown rice, dal and steamed vegetables",
        "Low sodium",
        "Nurse Maria",
        1
    ),
    (
        2,
        "2026-09-18",
        "Breakfast",
        "Diabetic Diet",
        "08:00",
        "Whole wheat toast, boiled egg and fruit",
        "Low sugar",
        "Nurse Sarah",
        1
    ),
    (
        3,
        "2026-09-18",
        "Lunch",
        "Balanced Diet",
        "13:00",
        "Rice, dal, vegetables and curd",
        "None",
        "Nurse Aisha",
        1
    ),
    (
        4,
        "2026-09-18",
        "Dinner",
        "Low Fat Diet",
        "19:30",
        "Chapati, vegetable curry and salad",
        "Low fat",
        "Nurse John",
        0
    )
]

cursor.executemany("""
    INSERT INTO meals (
        resident_id, meal_date, meal_type, diet_type,
        meal_time, menu, restrictions, recorded_by, given
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
""", meals)


# ---------------------------------------------------------
# CHECKUPS
# ---------------------------------------------------------

checkups = [
    (
        1,
        "2026-09-25",
        "10:00",
        "Dr. Mehta",
        "Routine Checkup",
        "Blood pressure monitoring",
        "Blood pressure slightly high",
        "Continue monitoring",
        "Scheduled",
        0
    ),
    (
        2,
        "2026-09-28",
        "11:00",
        "Dr. Shah",
        "Diabetes Checkup",
        "Blood sugar monitoring",
        "Sugar level requires monitoring",
        "Continue medication",
        "Scheduled",
        0
    )
]

cursor.executemany("""
    INSERT INTO checkups (
        resident_id, checkup_date, checkup_time, doctor,
        checkup_type, reason, findings, recommendations,
        status, completed
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", checkups)


# ---------------------------------------------------------
# ACTIVITIES
# ---------------------------------------------------------

activities = [
    (
        1,
        "Morning Walk",
        "Exercise",
        "2026-09-18",
        "07:00",
        "Garden",
        "John Mathew",
        "Light morning walk for residents",
        1
    ),
    (
        2,
        "Yoga Session",
        "Exercise",
        "2026-09-18",
        "09:00",
        "Activity Hall",
        "John Mathew",
        "Gentle yoga session",
        1
    ),
    (
        3,
        "Music Therapy",
        "Recreation",
        "2026-09-19",
        "16:00",
        "Activity Hall",
        "Sarah Thomas",
        "Group music activity",
        0
    )
]

cursor.executemany("""
    INSERT INTO activities (
        resident_id, activity_name, activity_type,
        activity_date, activity_time, location,
        staff_assigned, description, completed
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
""", activities)


# ---------------------------------------------------------
# DONATIONS
# ---------------------------------------------------------

donations = [
    (
        "Rahul Sharma",
        "9876000001",
        5000,
        "Cash",
        "2026-09-18",
        "Cash",
        "DON001",
        "General Support",
        "Monthly donation",
        1
    ),
    (
        "Priya Mehta",
        "9876000002",
        3500,
        "Online",
        "2026-09-17",
        "UPI",
        "DON002",
        "Medical Support",
        "For resident healthcare",
        1
    )
]

cursor.executemany("""
    INSERT INTO donations (
        donor_name, contact, amount, donation_type,
        donation_date, payment_method, reference_number,
        purpose, notes, received
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", donations)


# ---------------------------------------------------------
# VISITORS
# ---------------------------------------------------------

visitors = [
    (
        1,
        "Maria Khan",
        "Daughter",
        "9876100001",
        "2026-09-18",
        "15:00",
        "16:30",
        "Family Visit",
        "Regular family visit",
        1
    ),
    (
        2,
        "Ahmed Khan",
        "Son",
        "9876100002",
        "2026-09-18",
        "14:00",
        "15:00",
        "Family Visit",
        "",
        1
    ),
    (
        3,
        "Sara Ali",
        "Daughter",
        "9876100003",
        "2026-09-19",
        "17:00",
        "",
        "Family Visit",
        "Expected to leave later",
        0
    )
]

cursor.executemany("""
    INSERT INTO visitors (
        resident_id, visitor_name, relationship, contact,
        visit_date, check_in, check_out, purpose,
        notes, checked_out
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", visitors)


conn.commit()
conn.close()

print("Sample data added successfully!")