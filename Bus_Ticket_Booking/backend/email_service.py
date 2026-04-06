"""
Email service for sending booking confirmation emails via Gmail SMTP.

=== How to set up Gmail App Password ===
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification (required)
3. Go to https://myaccount.google.com/apppasswords
4. Select App = "Mail", Device = "Other" (type "SkyBook")
5. Click "Generate" — copy the 16-character password
6. Set it as SMTP_PASS in your .env file
   (e.g. SMTP_PASS=abcd efgh ijkl mnop)
   Note: spaces are optional, Google accepts with or without.

Normal Gmail password will NOT work if 2FA is enabled (which it should be).
"""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()
if not os.getenv("SMTP_USER"):
    load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "skybookofficial0@gmail.com")
SMTP_PASS = os.getenv("SMTP_PASS", "")


def send_booking_email(to_email: str, booking_data: dict) -> bool:
    """
    Send a rich HTML booking confirmation email.

    booking_data should contain:
      pnr, passenger_name, flight_number, airline,
      from_city, from_code, to_city, to_code,
      travel_date, departure_time, arrival_time,
      seats (list), total_amount, status
    """
    if not SMTP_PASS:
        print("[EMAIL] SMTP_PASS not set — skipping email send.")
        return False

    if not to_email:
        print("[EMAIL] No recipient email — skipping.")
        return False

    pnr = booking_data.get("pnr", "N/A")
    passenger = booking_data.get("passenger_name", "Traveller")
    flight = booking_data.get("flight_number", "")
    airline = booking_data.get("airline", "")
    from_city = booking_data.get("from_city", "")
    from_code = booking_data.get("from_code", "")
    to_city = booking_data.get("to_city", "")
    to_code = booking_data.get("to_code", "")
    travel_date = booking_data.get("travel_date", "")
    dep_time = booking_data.get("departure_time", "")
    arr_time = booking_data.get("arrival_time", "")
    seats = booking_data.get("seats", [])
    amount = booking_data.get("total_amount", 0)
    status = booking_data.get("status", "confirmed").capitalize()

    seats_str = ", ".join(seats) if seats else "Seat Not Selected / Assigned at Check-in"

    subject = f"✈️ Booking Confirmed — {from_code} → {to_code} | PNR: {pnr}"

    # ── Plain text fallback ──
    text_body = f"""
Hi {passenger},

Your flight booking is confirmed! 🎉

PNR: {pnr}
Flight: {airline} {flight}
Route: {from_city} ({from_code}) → {to_city} ({to_code})
Date: {travel_date}
Departure: {dep_time}   Arrival: {arr_time}
Seats: {seats_str}
Status: {status}
Amount Paid: ₹{amount:,.2f}

Thank you for booking with SkyBook!
Have a great flight ✈️

— SkyBook Team
"""

    # ── Rich HTML email ──
    html_body = f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background:#f4f6f9; font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <tr>
      <td style="background:linear-gradient(135deg,#0033A0,#0052CC); padding:32px 30px; text-align:center;">
        <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700;">✈️ Booking Confirmed</h1>
        <p style="margin:6px 0 0; color:rgba(255,255,255,0.8); font-size:14px;">Your e-ticket is ready</p>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding:30px;">
        <p style="margin:0 0 20px; color:#333; font-size:16px;">Hi <strong>{passenger}</strong>,</p>
        <p style="margin:0 0 24px; color:#555; font-size:14px; line-height:1.6;">
          Your flight has been successfully booked. Here are the details:
        </p>

        <!-- PNR Badge -->
        <table width="100%" style="margin-bottom:24px;">
          <tr>
            <td style="background:#f0f4ff; border-radius:12px; padding:16px 20px; text-align:center;">
              <span style="color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Booking Reference (PNR)</span><br>
              <span style="color:#0033A0; font-size:28px; font-weight:800; letter-spacing:3px;">{pnr}</span>
            </td>
          </tr>
        </table>

        <!-- Flight Details -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8ecf0; border-radius:12px; overflow:hidden; margin-bottom:24px;">
          <tr style="background:#f8fafc;">
            <td style="padding:14px 20px; font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;" colspan="2">
              {airline} • {flight}
            </td>
          </tr>
          <tr>
            <td style="padding:20px; text-align:center; width:45%;">
              <div style="font-size:28px; font-weight:800; color:#1a1a1a;">{dep_time}</div>
              <div style="font-size:14px; color:#555; margin-top:4px;">{from_city}</div>
              <div style="font-size:12px; color:#0033A0; font-weight:600;">{from_code}</div>
            </td>
            <td style="text-align:center; width:10%; color:#0033A0; font-size:20px;">→</td>
            <td style="padding:20px; text-align:center; width:45%;">
              <div style="font-size:28px; font-weight:800; color:#1a1a1a;">{arr_time}</div>
              <div style="font-size:14px; color:#555; margin-top:4px;">{to_city}</div>
              <div style="font-size:12px; color:#0033A0; font-weight:600;">{to_code}</div>
            </td>
          </tr>
          <tr style="background:#f8fafc;">
            <td style="padding:12px 20px; font-size:13px; color:#555;" colspan="3">
              📅 <strong>{travel_date}</strong> &nbsp;&nbsp; 💺 <strong>{seats_str}</strong> &nbsp;&nbsp; 📋 <strong>{status}</strong>
            </td>
          </tr>
        </table>

        <!-- Amount -->
        <table width="100%" style="margin-bottom:24px;">
          <tr>
            <td style="background:linear-gradient(135deg,#0033A0,#0052CC); border-radius:12px; padding:16px 20px; text-align:center;">
              <span style="color:rgba(255,255,255,0.8); font-size:12px;">Total Paid</span><br>
              <span style="color:#ffffff; font-size:24px; font-weight:800;">₹{amount:,.2f}</span>
            </td>
          </tr>
        </table>

        <p style="margin:0; color:#888; font-size:13px; line-height:1.6;">
          Please arrive at the airport at least 2 hours before departure.<br>
          Carry a valid photo ID for check-in.
        </p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background:#f8fafc; padding:20px 30px; text-align:center; border-top:1px solid #e8ecf0;">
        <p style="margin:0; color:#999; font-size:12px;">
          SkyBook — India's Most Trusted Flight Booking Platform<br>
          This is an automated email. Please do not reply.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"SkyBook <{SMTP_USER}>"
        msg["To"] = to_email

        msg.attach(MIMEText(text_body, "plain"))
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, to_email, msg.as_string())

        print(f"[EMAIL] Confirmation sent to {to_email} (PNR: {pnr})")
        return True

    except smtplib.SMTPAuthenticationError as e:
        print(f"[EMAIL] SMTP Auth failed - check SMTP_PASS (App Password required): {e}")
        return False
    except Exception as e:
        print(f"[EMAIL] Failed to send email: {e}")
        return False
