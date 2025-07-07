

class RootNodeException(BaseException):
    def __init__(self, message):
        self.message = 'Root node does not have siblings'
        super().__init__(message)
