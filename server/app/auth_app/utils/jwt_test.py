from jwt_ import CustomJWT


token = CustomJWT(content={"id": 14})
print(token.get_token())
