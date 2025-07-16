import jwt
import datetime
import os
from dotenv import load_dotenv
from pydantic import BaseModel, ConfigDict


load_dotenv()


class CustomTimeSerializer(BaseModel):
    model_config = ConfigDict(ser_json_timedelta="iso8601")
    duration: datetime.timedelta


class CustomJWT:
    # dev: add other parameters for configuring token if needed
    def __init__(
        self,
        secret=os.environ.get("JWT_SECRET"),
        content: dict = {},
        expires_in=datetime.timedelta(minutes=60),
    ):
        self.secret = secret
        self.content = content
        self.create_time = datetime.datetime.now().isoformat()
        self.expires_in = CustomTimeSerializer(duration=expires_in).model_dump_json()

    def get_token(self):
        payload = self.content
        payload.update({"exp": self.expires_in, "iat": self.create_time})
        token = jwt.encode(payload=payload, key=self.secret)
        return token
