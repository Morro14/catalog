from django.urls import path
from .views import RegisterView, LoginView, PasswordChangeView, UserView, LogoutView


urlpatterns = [
    path("login", LoginView.as_view()),
    path("logout", LogoutView.as_view()),
    path("register", RegisterView.as_view()),
    path("password-change", PasswordChangeView.as_view()),
    path("catalog", UserView.as_view()),
]
