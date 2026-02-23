import socket

def get_local_ip():
    """Get the local IP address of this computer"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

if __name__ == "__main__":
    ip = get_local_ip()
    print(f"\n{'='*50}")
    print(f"🌐 Your Computer IP Address: {ip}")
    print(f"{'='*50}")
    print(f"\n📱 For Android App:")
    print(f"   Update frontend-driver/src/utils/api.js")
    print(f"   Change IP to: http://{ip}:8000")
    print(f"\n⚠️  Important:")
    print(f"   - Android phone must be on SAME WiFi network")
    print(f"   - Backend must run with --host 0.0.0.0")
    print(f"\n🚀 Start backend with:")
    print(f"   py -m uvicorn main:app --host 0.0.0.0 --reload --port 8000")
    print(f"\n{'='*50}\n")
