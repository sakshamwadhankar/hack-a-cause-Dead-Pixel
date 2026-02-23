from twilio.rest import Client
from dotenv import load_dotenv
import os
import random

load_dotenv()

ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE = os.getenv("TWILIO_PHONE_NUMBER")
DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"

def generate_otp():
    """Generate a 4-digit OTP"""
    return str(random.randint(1000, 9999))

def send_otp_sms(phone_number: str, otp: str, driver_name: str):
    """
    Send real OTP via Twilio SMS.
    Falls back to console in DEMO_MODE.
    """
    message = (
        f"JalRakshak Driver App\n"
        f"Hello {driver_name}!\n"
        f"Your OTP is: {otp}\n"
        f"Valid for 10 minutes.\n"
        f"Do not share this OTP.\n"
        f"-District Water Authority"
    )
    
    if DEMO_MODE:
        print(f"\n{'='*50}")
        print(f"📱 SMS TO: +91{phone_number}")
        print(f"📨 MESSAGE:")
        print(message)
        print(f"{'='*50}\n")
        return {
            "success": True,
            "mode": "demo",
            "message": "OTP printed to console (DEMO MODE)"
        }
    
    try:
        client = Client(ACCOUNT_SID, AUTH_TOKEN)
        msg = client.messages.create(
            body=message,
            from_=TWILIO_PHONE,
            to=f"+91{phone_number}"
        )
        
        print(f"✅ SMS sent successfully! SID: {msg.sid}")
        return {
            "success": True,
            "mode": "live",
            "sid": msg.sid,
            "message": f"OTP sent to +91******{phone_number[-4:]}"
        }
    
    except Exception as e:
        print(f"❌ Twilio error: {e}")
        # Fallback to demo mode on error
        print(f"🔄 FALLBACK - OTP for {phone_number}: {otp}")
        return {
            "success": False,
            "mode": "fallback",
            "error": str(e),
            "fallback_otp": otp
        }

def validate_phone_number(phone: str) -> bool:
    """Validate Indian phone number format"""
    # Remove any spaces or special characters
    phone = phone.replace(" ", "").replace("-", "").replace("+91", "")
    
    # Check if it's 10 digits and starts with 6-9
    if len(phone) == 10 and phone.isdigit() and phone[0] in ['6', '7', '8', '9']:
        return True
    return False
