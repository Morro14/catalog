from datetime import datetime, timedelta
import random


def gen_random_datetime(start: datetime, end: datetime):
    delta = end - start
    random_seconds = delta * random.random()
    print(random_seconds, type(random_seconds))
    return start + random_seconds


data = gen_random_datetime(datetime(1900, 1, 1), datetime(2025, 1, 1))
print(data)
