import os
from dotenv import load_dotenv


load_dotenv()

server = os.environ.get("SMTP_SERVER")
username = os.environ.get("SMTP_USERNAME")
password = os.environ.get("SMTP_PASSWORD")
port = 465
