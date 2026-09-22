import sqlite3

DATABASE = "elderly_home.db"


def get_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def create_database():
    conn = get_connection()
    cursor = conn.cursor()

    # RESIDENTS
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS residents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            date_of_birth TEXT,
            age INTEGER,
            gender TEXT,
            room_no TEXT,
            contact TEXT,
            emergency_contact TEXT,
            address TEXT,
            health_status TEXT,
            blood_type TEXT,
            staff_assigned TEXT,
            medical_history TEXT,
            allergies TEXT,
            medicines TEXT,
            diet TEXT,
            blood_pressure TEXT,
            sugar TEXT,
            pulse TEXT,
            oxygen TEXT,
            weight TEXT,
            height TEXT,
            other_notes TEXT,
            upcoming_appointment TEXT,
            birthday TEXT,
            profile_image TEXT
        )
    """)

    # HEALTH RECORDS
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS health_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            resident_id INTEGER,
            record_date TEXT,
            blood_pressure TEXT,
            sugar TEXT,
            pulse TEXT,
            oxygen TEXT,
            temperature TEXT,
            weight TEXT,
            height TEXT,
            health_status TEXT,
            symptoms TEXT,
            diagnosis TEXT,
            notes TEXT,
            recorded_by TEXT,
            FOREIGN KEY (resident_id) REFERENCES residents(id)
        )
    """)

    # MEDICINES
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS medicines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            resident_id INTEGER,
            medicine_name TEXT,
            dosage TEXT,
            frequency TEXT,
            time_of_day TEXT,
            start_date TEXT,
            end_date TEXT,
            prescribed_by TEXT,
            instructions TEXT,
            status TEXT,
            FOREIGN KEY (resident_id) REFERENCES residents(id)
        )
    """)

    # MEDICINE ADMINISTRATION
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS medicine_administration (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            medicine_id INTEGER,
            administered_date TEXT,
            administered_time TEXT,
            status TEXT,
            administered_by TEXT,
            FOREIGN KEY (medicine_id) REFERENCES medicines(id)
        )
    """)

    # MEALS
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS meals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            resident_id INTEGER,
            meal_date TEXT,
            meal_type TEXT,
            diet_type TEXT,
            meal_time TEXT,
            menu TEXT,
            restrictions TEXT,
            recorded_by TEXT,
            given INTEGER DEFAULT 0,
            FOREIGN KEY (resident_id) REFERENCES residents(id)
        )
    """)

    # CHECKUPS
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS checkups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            resident_id INTEGER,
            checkup_date TEXT,
            checkup_time TEXT,
            doctor TEXT,
            checkup_type TEXT,
            reason TEXT,
            findings TEXT,
            recommendations TEXT,
            status TEXT,
            completed INTEGER DEFAULT 0,
            FOREIGN KEY (resident_id) REFERENCES residents(id)
        )
    """)

    # STAFF
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS staff (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT,
            gender TEXT,
            age INTEGER,
            contact TEXT,
            email TEXT,
            address TEXT,
            joining_date TEXT,
            shift TEXT,
            department TEXT,
            qualification TEXT,
            experience TEXT,
            status TEXT,
            profile_image TEXT
        )
    """)

    # ACTIVITIES
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            resident_id INTEGER,
            activity_name TEXT,
            activity_type TEXT,
            activity_date TEXT,
            activity_time TEXT,
            location TEXT,
            staff_assigned TEXT,
            description TEXT,
            completed INTEGER DEFAULT 0,
            FOREIGN KEY (resident_id) REFERENCES residents(id)
        )
    """)

    # DONATIONS
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS donations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            donor_name TEXT,
            contact TEXT,
            amount REAL,
            donation_type TEXT,
            donation_date TEXT,
            payment_method TEXT,
            reference_number TEXT,
            purpose TEXT,
            notes TEXT,
            received INTEGER DEFAULT 1
        )
    """)

    # VISITORS
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS visitors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            resident_id INTEGER,
            visitor_name TEXT,
            relationship TEXT,
            contact TEXT,
            visit_date TEXT,
            check_in TEXT,
            check_out TEXT,
            purpose TEXT,
            notes TEXT,
            checked_out INTEGER DEFAULT 0,
            FOREIGN KEY (resident_id) REFERENCES residents(id)
        )
    """)

    conn.commit()
    conn.close()


if __name__ == "__main__":
    create_database()
    print("Database created successfully!")
    
