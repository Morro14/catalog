from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django_rest_passwordreset.signals import reset_password_token_created
from django.conf import settings
from django.urls import reverse
import os
from .loggers import UserLogger

logger = UserLogger("users.log")


@receiver(reset_password_token_created)
def send_pwd_reset_email(sender, instance, reset_password_token, *args, **kwargs):
    print("signal")
    logger.log(
        "DEBUG", f"User {reset_password_token.user.email} has requested password reset."
    )
    context = {
        "user": reset_password_token.user,
        "email": reset_password_token.user.email,
        "reset_password_url": "{}?token={}".format(
            instance.request.build_absolute_uri(
                reverse("password_reset:reset-password-confirm")
            ),
            reset_password_token.key,
        ),
    }

    email_html_msg = render_to_string(
        os.path.join(settings.BASE_DIR, "templates/password_reset.html"), context
    )
    email_text_msg = render_to_string(
        os.path.join(settings.BASE_DIR, "templates/password_reset.txt"), context
    )
    print("sending to:", reset_password_token.user.email)
    msg = EmailMultiAlternatives(
        subject="Password reset for {title}".format(title="Catalog App"),
        body=email_text_msg,
        from_email=os.environ.get("SMTP_USERNAME"),
        # dev testing
        # to=[token.user],
        to=[reset_password_token.user.email],
    )

    msg.attach_alternative(email_html_msg, "text/html")
    # msg.send(fail_silently=False)
