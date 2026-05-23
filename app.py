from flask import Flask, render_template, request, redirect, session, flash, Response
import mysql.connector
import csv
import io
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import *

# print(DB_HOST)

# =====================================
# APP CONFIG
# =====================================
app = Flask(__name__)
app.secret_key = SECRET_KEY


# =====================================
# MYSQL CONNECTION
# =====================================
def get_db():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT
    )


# =====================================
# EMAIL ALERT FUNCTION
# =====================================
def send_lead_email(name, email, phone, project, budget, message):

    try:

        subject = f"New Lead Received - {name}"

        body = f"""
New Lead Submitted

Name: {name}
Email: {email}
Phone: {phone}
Project: {project}
Budget: {budget}

Message:
{message}
"""

        msg = MIMEMultipart()

        msg["From"] = EMAIL_USER
        msg["To"] = ALERT_TO
        msg["Subject"] = subject

        msg.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP_SSL(
        "smtp.gmail.com",
        465,
        timeout=10
        )

        server.login(
            EMAIL_USER,
            EMAIL_PASS
        )

        server.send_message(msg)

        server.quit()

        print("EMAIL SENT SUCCESSFULLY")

    except Exception as e:

        print("EMAIL ERROR:", e)

# =====================================
# HOME PAGE
# =====================================
@app.route("/")
def home():
    return render_template("index.html")


# =====================================
# CONTACT FORM SUBMIT
# =====================================
# =====================================
# CONTACT FORM SUBMIT
# =====================================
@app.route("/contact", methods=["POST"])
def contact():

    full_name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip()
    phone = request.form.get("phone", "").strip()
    company = request.form.get("company", "").strip()
    project_type = request.form.get("projectType", "").strip()
    budget = request.form.get("budget", "").strip()
    timeline = request.form.get("timeline", "").strip()
    reference = request.form.get("reference", "").strip()
    message = request.form.get("message", "").strip()

    try:

        # DATABASE CONNECTION
        conn = get_db()
        cursor = conn.cursor()

        # INSERT LEAD
        cursor.execute("""
            INSERT INTO leads(
                full_name,
                email,
                phone,
                company,
                project_type,
                budget,
                timeline,
                reference_source,
                message
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            full_name,
            email,
            phone,
            company,
            project_type,
            budget,
            timeline,
            reference,
            message
        ))

        # SAVE TO DATABASE
        conn.commit()

        # CLOSE CONNECTION
        cursor.close()
        conn.close()

        # SEND EMAIL SAFELY
        send_lead_email(
            full_name,
            email,
            phone,
            project_type,
            budget,
            message
        )

        # SUCCESS PAGE
        return render_template(
            "success.html",
            name=full_name
        )

    except Exception as e:

        print("CONTACT ERROR:", e)

        flash("Something went wrong.")

        return redirect("/")
# =====================================
# ADMIN LOGIN
# =====================================
@app.route("/admin-login", methods=["GET", "POST"])
def admin_login():

    if request.method == "POST":

        username = request.form["username"]
        password = request.form["password"]

        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            session["admin"] = True
            return redirect("/admin-dashboard")

        flash("Invalid Login")

    return render_template("admin_login.html")


# =====================================
# ADMIN DASHBOARD
# =====================================
@app.route("/admin-dashboard")
def admin_dashboard():

    try:

        if not session.get("admin"):
            return redirect("/admin-login")

        page = request.args.get("page", 1, type=int)
        per_page = 10
        offset = (page - 1) * per_page

        search = request.args.get("search", "")
        from_date = request.args.get("from_date", "")
        to_date = request.args.get("to_date", "")

        conn = get_db()
        cursor = conn.cursor()

        base_sql = """
        FROM leads
        WHERE 1=1
        """

        values = []

        if search:
            base_sql += " AND (full_name LIKE %s OR email LIKE %s)"
            values.extend([
                "%" + search + "%",
                "%" + search + "%"
            ])

        if from_date and to_date:
            base_sql += " AND DATE(created_at) BETWEEN %s AND %s"
            values.extend([from_date, to_date])

        # TOTAL LEADS
        cursor.execute(
            "SELECT COUNT(*) " + base_sql,
            tuple(values)
        )

        total = cursor.fetchone()[0]

        # FETCH LEADS
        sql = """
        SELECT 
            id,
            full_name,
            email,
            phone,
            company,
            project_type,
            budget,
            status,
            created_at,
            notes
        """ + base_sql + """
        ORDER BY id DESC
        LIMIT %s OFFSET %s
        """

        values2 = values.copy()
        values2.extend([per_page, offset])

        cursor.execute(sql, tuple(values2))
        leads = cursor.fetchall()

        # STATUS CHART
        cursor.execute("""
            SELECT status, COUNT(*)
            FROM leads
            GROUP BY status
        """)

        status_data = cursor.fetchall()

        # MONTHLY CHART
        cursor.execute("""
            SELECT 
                MONTHNAME(created_at),
                COUNT(*)
            FROM leads
            GROUP BY 
                MONTH(created_at),
                MONTHNAME(created_at)
            ORDER BY MONTH(created_at)
        """)

        monthly_data = cursor.fetchall()

        cursor.close()
        conn.close()

        total_pages = (total + per_page - 1) // per_page

        return render_template(
            "admin_dashboard.html",
            leads=leads,
            status_data=status_data,
            monthly_data=monthly_data,
            page=page,
            total_pages=total_pages
        )

    except Exception as e:
        return f"ADMIN DASHBOARD ERROR: {e}"
# =====================================
# UPDATE STATUS
# =====================================
@app.route("/update-status/<int:id>", methods=["POST"])
def update_status(id):

    if not session.get("admin"):
        return redirect("/admin-login")

    status = request.form["status"]

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE leads SET status=%s WHERE id=%s",
        (status, id)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return redirect("/admin-dashboard")


# =====================================
# SAVE NOTE
# =====================================
@app.route("/save-note/<int:id>", methods=["POST"])
def save_note(id):

    if not session.get("admin"):
        return redirect("/admin-login")

    notes = request.form["notes"]

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE leads SET notes=%s WHERE id=%s",
        (notes, id)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return redirect("/admin-dashboard")


# =====================================
# DELETE LEAD
# =====================================
@app.route("/delete/<int:id>")
def delete(id):

    if not session.get("admin"):
        return redirect("/admin-login")

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM leads WHERE id=%s",
        (id,)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return redirect("/admin-dashboard")


# =====================================
# EXPORT CSV
# =====================================
@app.route("/export-csv")
def export_csv():

    if not session.get("admin"):
        return redirect("/admin-login")

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, full_name, email, phone,
        company, project_type, budget,
        status, created_at
        FROM leads
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "ID",
        "Name",
        "Email",
        "Phone",
        "Company",
        "Project",
        "Budget",
        "Status",
        "Date"
    ])

    for row in rows:
        writer.writerow(row)

    response = Response(
        output.getvalue(),
        mimetype="text/csv"
    )

    response.headers[
        "Content-Disposition"
    ] = "attachment; filename=leads.csv"

    return response


# =====================================
# LOGOUT
# =====================================
@app.route("/logout")
def logout():
    session.clear()
    return redirect("/admin-login")


@app.route("/testdb")
def testdb():

    try:
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("SELECT 1")

        result = cursor.fetchone()

        cursor.close()
        conn.close()

        return f"DB Connected Successfully: {result}"

    except Exception as e:
        return f"DB Error: {e}"

@app.route("/test-email")
def test_email():

    try:

        send_lead_email(
            "Test User",
            "test@gmail.com",
            "9999999999",
            "Website",
            "5000",
            "This is a test email"
        )

        return "EMAIL FUNCTION EXECUTED"

    except Exception as e:

        return f"EMAIL TEST ERROR: {e}"
# =====================================
# RUN SERVER
# =====================================
if __name__ == "__main__":
    app.run(debug=True)