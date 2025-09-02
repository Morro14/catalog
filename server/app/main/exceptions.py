class RootNodeException(BaseException):
    def __init__(self):
        self.message = "Root node does not have siblings"
        super().__init__(self.message)


class NameDublicateException(BaseException):
    def __init__(self):
        self.message = "A file with this name already exists in this directory"
        super().__init__(self.message)
