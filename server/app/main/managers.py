from django.contrib.auth.base_user import BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        user = self.model(email=email, password=password, **extra_fields)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):

        user = self.model(email=email, is_superuser=True, is_staff=True, **extra_fields)
        user.set_password(password)
        user.save()
        return user
