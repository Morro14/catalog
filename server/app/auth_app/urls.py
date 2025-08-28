from django.urls import path, include
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    ProfileView,
    GoogleLoginView,
    TempTokenConvert,
)


urlpatterns = [
    path("login", LoginView.as_view()),
    path("logout", LogoutView.as_view()),
    path("register", RegisterView.as_view()),
    #
    # POST ${API_URL}/ - request a reset password token by using the email parameter
    # POST ${API_URL}/confirm/ - using a valid token, the users password is set to the provided password
    # POST ${API_URL}/validate_token/ - will return a 200 if a given token is valid
    path("password-reset/", include("django_rest_passwordreset.urls")),
    path("profile", ProfileView.as_view()),
    path("google/callback", GoogleLoginView.as_view()),
    path("temp-token-convert", TempTokenConvert.as_view()),
]
