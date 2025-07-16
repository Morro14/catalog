import smtplib
from smtp_config import server, username, password, port


class EmailNotification:
    def __init__(self, server=server, username=username, password=password, port=port):
        self.server = server
        self.username = username
        self.password = password
        self.port = port

    def password_reset(self):
        pass
