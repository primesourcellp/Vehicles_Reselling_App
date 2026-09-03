from django.urls import path

from .views import (
    LoginOTPRequestView,
    LoginOTPVerifyView,
    MeView,
    PasswordLoginView,
    RegisterVerifyOTPView,
    RegisterView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('register/verify-otp/', RegisterVerifyOTPView.as_view(), name='auth-register-verify'),
    path('login/otp/request/', LoginOTPRequestView.as_view(), name='auth-login-otp-request'),
    path('login/otp/verify/', LoginOTPVerifyView.as_view(), name='auth-login-otp-verify'),
    path('login/password/', PasswordLoginView.as_view(), name='auth-login-password'),
    path('me/', MeView.as_view(), name='auth-me'),
]
