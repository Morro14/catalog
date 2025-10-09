from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from django.conf import settings



def get_driver_service(user):

    creds = Credentials(
        token=user.google_access_token,
        refresh_token=user.google_refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        scopes=["https://www.googleapis.com/auth/drive.metadata.readonly"],
    )
    # if not creds.valid and creds.expired and creds.refresh_token:
    #     creds.refresh(Request())
    service = build("drive", "v3", credentials=creds)
    return service
