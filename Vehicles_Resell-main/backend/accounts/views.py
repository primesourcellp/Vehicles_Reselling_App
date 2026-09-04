from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import OTPPurpose
from .otp import create_otp, send_otp_email, verify_otp
from .serializers import (
    OTPRequestSerializer,
    OTPVerifySerializer,
    PasswordLoginSerializer,
    RegisterSerializer,
    UserSerializer,
)

User = get_user_model()


def tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def otp_payload(otp, message, email=None, extra=None):
    data = {
        'message': message,
        'mobile': otp.mobile,
        'expires_in_minutes': settings.OTP_EXPIRY_MINUTES,
    }
    if email:
        data['email'] = email
    # DEBUG only — also returned so you can test without checking email
    if settings.DEBUG:
        data['dev_otp'] = otp.code
    if extra:
        data.update(extra)
    return data


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        password = data.get('password') or None
        user = User.objects.create_user(
            mobile=data['mobile'],
            email=data['email'],
            full_name=data['full_name'],
            password=password,
            city=data['city'],
            state=data['state'],
            pin_code=data['pin_code'],
            accepted_terms=data['accepted_terms'],
            is_mobile_verified=False,
        )
        otp = create_otp(user.mobile, OTPPurpose.REGISTER)
        send_otp_email(user.email, otp.code, OTPPurpose.REGISTER, user.full_name)
        return Response(
            otp_payload(
                otp,
                'Registration started. OTP sent to your email.',
                email=user.email,
                extra={'user_id': str(user.id)},
            ),
            status=status.HTTP_201_CREATED,
        )


class RegisterVerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        mobile = serializer.validated_data['mobile']
        code = serializer.validated_data['otp']

        ok, message = verify_otp(mobile, OTPPurpose.REGISTER, code)
        if not ok:
            return Response({'detail': message}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(mobile=mobile)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        user.is_mobile_verified = True
        user.save(update_fields=['is_mobile_verified', 'updated_at'])

        return Response(
            {
                'message': 'Email verified successfully.',
                'user': UserSerializer(user).data,
                'tokens': tokens_for_user(user),
            }
        )


class RegisterResendOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        mobile = serializer.validated_data['mobile']

        try:
            user = User.objects.get(mobile=mobile)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user.is_mobile_verified:
            return Response(
                {'detail': 'Account already verified. Please log in.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not user.is_active:
            return Response({'detail': 'Account is inactive.'}, status=status.HTTP_403_FORBIDDEN)

        otp = create_otp(mobile, OTPPurpose.REGISTER)
        send_otp_email(user.email, otp.code, OTPPurpose.REGISTER, user.full_name)
        return Response(
            otp_payload(otp, 'OTP resent to your email.', email=user.email)
        )


class LoginOTPRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        mobile = serializer.validated_data['mobile']

        try:
            user = User.objects.get(mobile=mobile)
        except User.DoesNotExist:
            return Response(
                {'detail': 'No account found with this mobile number.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not user.is_active:
            return Response({'detail': 'Account is inactive.'}, status=status.HTTP_403_FORBIDDEN)

        otp = create_otp(mobile, OTPPurpose.LOGIN)
        send_otp_email(user.email, otp.code, OTPPurpose.LOGIN, user.full_name)
        return Response(
            otp_payload(otp, 'OTP sent to your email.', email=user.email)
        )


class LoginOTPVerifyView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        mobile = serializer.validated_data['mobile']
        code = serializer.validated_data['otp']

        ok, message = verify_otp(mobile, OTPPurpose.LOGIN, code)
        if not ok:
            return Response({'detail': message}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(mobile=mobile)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not user.is_mobile_verified:
            user.is_mobile_verified = True
            user.save(update_fields=['is_mobile_verified', 'updated_at'])

        return Response(
            {
                'message': 'Login successful.',
                'user': UserSerializer(user).data,
                'tokens': tokens_for_user(user),
            }
        )


class PasswordLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        return Response(
            {
                'message': 'Login successful.',
                'user': UserSerializer(user).data,
                'tokens': tokens_for_user(user),
            }
        )


class MeView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        user = request.user
        data = request.data

        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'city' in data:
            user.city = data['city']
        if 'state' in data:
            user.state = data['state']
        if 'pin_code' in data:
            user.pin_code = data['pin_code']
        if 'email' in data:
            email = str(data['email']).lower().strip()
            if User.objects.exclude(pk=user.pk).filter(email__iexact=email).exists():
                return Response({'detail': 'Email already in use.'}, status=status.HTTP_400_BAD_REQUEST)
            user.email = email

        user.save()
        return Response(UserSerializer(user).data)
