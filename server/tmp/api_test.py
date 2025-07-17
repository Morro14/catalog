import httpx, asyncio


URL = "http://127.0.0.1:8000/"


async def main(email, password):
    async def login_view_test(email=email, password=password):
        async with httpx.AsyncClient() as client:
            r = await client.post(
                url=URL + "auth/login", data={"email": email, "password": password}
            )
        print("Login response:", r.cookies)
        token = r.cookies.get("jwt")
        print("Token:", token)
        return token

    async def user_view_test(token):

        async with httpx.AsyncClient() as client:
            r = await client.get(url=URL + "auth/catalog", cookies={"jwt": token})
        print("User view response:", r.content)

    token = await login_view_test()
    await user_view_test(token)

    async def test_logout():
        async with httpx.AsyncClient() as client:
            r = await client.get(URL + "auth/logout")
        print("Logout view response", r.content)

    await test_logout()


asyncio.run(main("email1@test.com", "qwer"))
