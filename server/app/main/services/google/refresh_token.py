from django.conf import settings
import requests


def refresh_google_token(user):
    url = "https://oauth2.googleapis.com/token"
    data = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "refresh_token": user.google_refresh_token,
        "grant_type": "refresh_token",
    }
    r = requests(url, data=data)
    token_data = r.json()

    if "access_token" not in token_data:
        raise Exception("Failed to get access token: {token_data}")

    user.google_access_token = token_data["access_token"]
    user.save()
    return token_data["access_token"]
