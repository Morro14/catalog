import logging


class UserLogger:
    def __init__(self, log_file):
        self.logger = logging.getLogger("user_logger")
        self.logger.setLevel("DEBUG")
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )

        file_handler = logging.FileHandler(log_file, "a", "utf-8")
        file_handler.setLevel("DEBUG")
        file_handler.setFormatter(formatter)
        self.logger.addHandler(file_handler)

    def log(self, level, message):

        if level == "INFO":
            self.logger.info(message)
        if level == "ERROR":
            self.logger.error(message)
        if level == "DEBUG":
            print("UserLogger.log", "debug")
            self.logger.debug(message)
