from loggers import UserLogger


logger = UserLogger("test_log.log")
logger.log("DEBUG", f"User @@ has requested password reset.")
