"""
Email notification simulation.
In production, replace with SMTP/SendGrid/SES integration.
All emails are printed to the console (stdout) for demo purposes.
"""

from datetime import datetime
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

from app.core.config import settings


def _render_booking_html(user_name: str, booking_id: int, bus_number: str,
                         seat_number: int, journey_date: str, total_amount: float) -> str:
    # Simple responsive HTML template for booking confirmation
    return f"""
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }}
            .header {{ background-color: #6366f1; color: white; padding: 30px 20px; text-align: center; border-bottom: 5px solid #4f46e5; }}
            .header h1 {{ margin: 0; font-size: 24px; font-weight: 700; }}
            .header p {{ margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }}
            .content {{ padding: 30px; color: #333; line-height: 1.6; }}
            .content h2 {{ color: #2e7d32; font-size: 20px; margin-top: 0; margin-bottom: 20px; }}
            .details-box {{ background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0; }}
            .details-box h3 {{ margin-top: 0; font-size: 14px; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; }}
            .detail-row {{ display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }}
            .detail-label {{ color: #64748b; font-weight: 500; }}
            .detail-value {{ color: #0f172a; font-weight: 600; text-align: right; }}
            .footer {{ background-color: #ffffff; padding: 20px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #f1f5f9; }}
            .note {{ font-size: 13px; color: #64748b; text-align: center; margin-top: 20px; font-style: italic; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚍 RouteXen</h1>
                <p>Your travel experience awaits!</p>
            </div>
            <div class="content">
                <h2>Booking Confirmed Successfully! ✅</h2>
                <p>Dear <strong>{user_name}</strong>,</p>
                <p>Your booking for bus <strong>{bus_number}</strong> has been confirmed. Get ready for an amazing journey!</p>
                
                <div class="details-box">
                    <h3>Booking Details</h3>
                    <div class="detail-row">
                        <span class="detail-label">Booking ID:</span>
                        <span class="detail-value">#{booking_id}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Bus Number:</span>
                        <span class="detail-value">{bus_number}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Seat Number:</span>
                        <span class="detail-value">{seat_number}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Journey Date:</span>
                        <span class="detail-value">{journey_date}</span>
                    </div>
                    <div class="detail-row" style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #cbd5e1; font-size: 16px;">
                        <span class="detail-label" style="color: #0f172a;">Total Paid:</span>
                        <span class="detail-value" style="color: #6366f1;">₹{total_amount:.2f}</span>
                    </div>
                </div>
                
                <p class="note">Please arrive at the boarding point 15 minutes before departure. Enjoy the ride! 🚌</p>
            </div>
            <div class="footer">
                Thank you for choosing RouteXen
            </div>
        </div>
    </body>
    </html>
    """

def _render_admin_html(booking_id: int, user_email: str, bus_number: str,
                       seat_number: int, total_amount: float) -> str:
    return f"""
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }}
            .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }}
            .header {{ background-color: #1e293b; color: white; padding: 25px 20px; text-align: center; border-bottom: 5px solid #0f172a; }}
            .header h1 {{ margin: 0; font-size: 22px; }}
            .content {{ padding: 30px; color: #333; line-height: 1.6; }}
            .details-box {{ background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }}
            .detail-row {{ display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }}
            .detail-label {{ color: #64748b; font-weight: 500; min-width: 120px; }}
            .detail-value {{ color: #0f172a; font-weight: 600; text-align: right; word-break: break-all; }}
            .highlight {{ color: #ef4444; font-weight: bold; font-size: 16px; }}
            .footer {{ background-color: #ffffff; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🛡️ Admin RouteXen</h1>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #cbd5e1;">New Booking Notification</p>
            </div>
            <div class="content">
                <p>Hello Admin,</p>
                <p>A new booking has been successfully processed. Here are the details:</p>
                
                <div class="details-box">
                    <div class="detail-row">
                        <span class="detail-label">Booking ID:</span>
                        <span class="detail-value">#{booking_id}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">User Email:</span>
                        <span class="detail-value">{user_email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Bus Number:</span>
                        <span class="detail-value">{bus_number}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Seat Number:</span>
                        <span class="detail-value">{seat_number}</span>
                    </div>
                    <div class="detail-row" style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #cbd5e1;">
                        <span class="detail-label" style="color: #0f172a;">Total Paid:</span>
                        <span class="highlight">₹{total_amount:.2f}</span>
                    </div>
                </div>
            </div>
            <div class="footer">
                Automated message from RouteXen Platform
            </div>
        </div>
    </body>
    </html>
    """

def _send_via_smtp(subject: str, to_email: str, html_body: str, text_body: Optional[str] = None) -> None:
        if not settings.SMTP_ENABLED:
                raise RuntimeError("SMTP is not enabled in settings")

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"RouteXen Admin <{settings.ADMIN_EMAIL}>"
        msg["To"] = to_email

        part_text = MIMEText(text_body or "", "plain")
        part_html = MIMEText(html_body, "html")
        msg.attach(part_text)
        msg.attach(part_html)

        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10)
        try:
                if settings.SMTP_USE_TLS:
                        server.starttls()
                if settings.SMTP_USER and settings.SMTP_PASSWORD:
                        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.sendmail(settings.SMTP_FROM, [to_email], msg.as_string())
        finally:
                server.quit()


def send_booking_confirmation_email(user_email: str, user_name: str, booking_id: int,
                                                                         bus_number: str, seat_number: int,
                                                                         journey_date: str, total_amount: float) -> None:
        subject = f"RouteXen – Booking Confirmed #{booking_id}"
        html = _render_booking_html(user_name, booking_id, bus_number, seat_number, journey_date, total_amount)
        text = (f"Hi {user_name},\nYour booking #{booking_id} is confirmed. Bus: {bus_number}, "
                        f"Seat: {seat_number}, Date: {journey_date}, Amount: ₹{total_amount:.2f}")

        # Try SMTP send if enabled, otherwise print to console
        if settings.SMTP_ENABLED:
                try:
                        _send_via_smtp(subject, user_email, html, text)
                        return
                except Exception as e:
                        # Fallback to console but do not raise
                        print(f"SMTP send failed, falling back to console output: {e}")

        # Console fallback
        print("\n" + "=" * 60)
        print("📧  EMAIL NOTIFICATION (simulated)")
        print("=" * 60)
        print(f"  TO      : {user_email}")
        print(f"  SUBJECT : {subject}")
        print(f"  BODY (text):\n{text}")
        print("=" * 60 + "\n")


def send_admin_notification_email(admin_email: str, booking_id: int,
                                                                     user_email: str, bus_number: str,
                                                                     seat_number: int, total_amount: float) -> None:
        subject = f"RouteXen – New Booking #{booking_id}"
        html = _render_admin_html(booking_id, user_email, bus_number, seat_number, total_amount)
        text = (f"New booking #{booking_id} by {user_email}. Bus: {bus_number}, "
                        f"Seat: {seat_number}, Amount: ₹{total_amount:.2f}")

        if settings.SMTP_ENABLED:
                try:
                        _send_via_smtp(subject, admin_email, html, text)
                        return
                except Exception as e:
                        print(f"SMTP send failed for admin email, falling back to console output: {e}")

        print("\n" + "=" * 60)
        print("📧  ADMIN EMAIL NOTIFICATION (simulated)")
        print("=" * 60)
        print(f"  TO      : {admin_email}")
        print(f"  SUBJECT : {subject}")
        print(f"  BODY (text):\n{text}")
        print("=" * 60 + "\n")
