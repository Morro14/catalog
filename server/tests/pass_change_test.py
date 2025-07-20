import httpx


URL = "http://127.0.0.1:8000/"


r = httpx.post(
    url=URL + "auth/password-recovery-req", data={"email": "email1@test.com"}
)
print(r.cookies)
print("Pass recovery response:", r)
