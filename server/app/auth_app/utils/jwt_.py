import jwt
import datetime
import time
import os
from dotenv import load_dotenv
from pydantic import BaseModel, ConfigDict


load_dotenv()


# class CustomTimeSerializer(BaseModel):
#     model_config = ConfigDict(ser_json_timedelta="iso8601")
#     duration: datetime.timedelta


class CustomJWT:
    # dev: add other parameters for configuring token if needed
    def __init__(
        self,
        secret=os.environ.get("JWT_SECRET"),
        content: dict = {},
        expires_in=36000,
    ):
        self.secret = secret
        self.content = content
        self.issued_at = int(time.time())
        self.expires_in = expires_in

    def get_token(self):
        payload = self.content
        payload.update({"exp": self.issued_at + self.expires_in, "iat": self.issued_at})
        token = jwt.encode(payload=payload, key=self.secret, algorithm="HS256")
        return token


class CustomJWTTest:
    def __init__(
        self,
        secret=os.environ.get("JWT_SECRET"),
        content: dict = {},
        expires_in=3600,
    ):
        self.secret = secret
        self.content = content
        self.issued_at = int(time.time())
        self.expires_in = expires_in

    def get_token(self):
        payload = self.content.copy()
        payload.update({"exp": self.issued_at + self.expires_in, "iat": self.issued_at})
        token = jwt.encode(
            payload=payload,
            key="-c8tmt91^3-vt4(39wgy=4ks*oov)(a)-w*xk&#ako@zn2^s_3",
            algorithm="HS256",
        )
        return token
