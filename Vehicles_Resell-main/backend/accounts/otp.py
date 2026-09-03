import random
import string
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from .models import OTPCode, OTPPurpose


def generate_otp_code(length=None):
    length = length or settings.OTP_LENGTH
    return ''.join(random.choices(string.digits, k=length))


def create_otp(mobile, purpose):
    OTPCode.objects.filter(mobile=mobile, purpose=purpose, is_used=False).update(is_used=True)
    return OTPCode.objects.create(
        mobile=mobile,
        code=generate_otp_code(),
        purpose=purpose,
        expires_at=timezone.now() + timedelta(minutes=settings.OTP_EXPIRY_MINUTES),
    )


def send_otp_email(email, code, purpose, full_name=''):
    """Send OTP to the user's email address."""
    if purpose == OTPPurpose.REGISTER:
        subject = 'Verify your Vehicle Reselling account'
        action = 'complete your registration'
    else:
        subject = 'Your Vehicle Reselling login code'
        action = 'log in to your account'

    name = full_name or 'there'
    message = (
        f'Hi {name},\n\n'
        f'Your OTP to {action} is: {code}\n\n'
        f'This code expires in {settings.OTP_EXPIRY_MINUTES} minutes.\n'
        f'If you did not request this, you can ignore this email.\n\n'
        f'— Vehicle Reselling'
    )

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )


def verify_otp(mobile, purpose, code):
    otp = (
        OTPCode.objects.filter(mobile=mobile, purpose=purpose, is_used=False)
        .order_by('-created_at')
        .first()
    )
    if not otp:
        return False, 'No OTP found. Please request a new code.'

    if otp.is_expired:
        otp.is_used = True
        otp.save(update_fields=['is_used'])
        return False, 'OTP has expired. Please request a new code.'

    if otp.attempts >= settings.OTP_MAX_ATTEMPTS:
        otp.is_used = True
        otp.save(update_fields=['is_used'])
        return False, 'Too many invalid attempts. Please request a new code.'

    if otp.code != code:
        otp.attempts += 1
        otp.save(update_fields=['attempts'])
        remaining = settings.OTP_MAX_ATTEMPTS - otp.attempts
        return False, f'Invalid OTP. {remaining} attempt(s) remaining.'

    otp.is_used = True
    otp.save(update_fields=['is_used'])
    return True, 'OTP verified successfully.'
