from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'full_name',
            'mobile',
            'email',
            'city',
            'state',
            'pin_code',
            'is_mobile_verified',
            'accepted_terms',
            'date_joined',
        )
        read_only_fields = fields


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    mobile = serializers.RegexField(
        regex=r'^\d{10}$',
        error_messages={'invalid': 'Enter a valid 10-digit mobile number.'},
    )
    email = serializers.EmailField()
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    pin_code = serializers.RegexField(
        regex=r'^\d{6}$',
        error_messages={'invalid': 'Enter a valid 6-digit PIN code.'},
    )
    password = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True,
        style={'input_type': 'password'},
    )
    accepted_terms = serializers.BooleanField()

    def validate_accepted_terms(self, value):
        if not value:
            raise serializers.ValidationError(
                'You must accept the Terms & Conditions and Privacy Policy.'
            )
        return value

    def validate_mobile(self, value):
        if User.objects.filter(mobile=value).exists():
            raise serializers.ValidationError('Mobile number already registered.')
        return value

    def validate_email(self, value):
        value = value.lower().strip()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('Email already registered.')
        return value

    def validate_password(self, value):
        if value:
            if len(value) < 6:
                raise serializers.ValidationError('Password must be at least 6 characters.')
            validate_password(value)
        return value


class OTPRequestSerializer(serializers.Serializer):
    mobile = serializers.RegexField(
        regex=r'^\d{10}$',
        error_messages={'invalid': 'Enter a valid 10-digit mobile number.'},
    )


class OTPVerifySerializer(serializers.Serializer):
    mobile = serializers.RegexField(
        regex=r'^\d{10}$',
        error_messages={'invalid': 'Enter a valid 10-digit mobile number.'},
    )
    otp = serializers.RegexField(
        regex=r'^\d{6}$',
        error_messages={'invalid': 'Enter a valid 6-digit OTP.'},
    )


class PasswordLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_blank=True)
    mobile = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, attrs):
        email = (attrs.get('email') or '').strip().lower()
        mobile = (attrs.get('mobile') or '').strip()
        password = attrs.get('password')

        if not email and not mobile:
            raise serializers.ValidationError('Provide either email or mobile number.')
        if email and mobile:
            raise serializers.ValidationError('Provide either email or mobile, not both.')

        if email:
            user = User.objects.filter(email__iexact=email).first()
        else:
            user = User.objects.filter(mobile=mobile).first()

        if not user or not user.has_usable_password() or not user.check_password(password):
            raise serializers.ValidationError('Invalid credentials.')
        if not user.is_active:
            raise serializers.ValidationError('Account is inactive.')
        if not user.is_mobile_verified:
            raise serializers.ValidationError('Mobile number is not verified.')

        attrs['user'] = user
        return attrs
