import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, mobile, email, full_name, password=None, **extra):
        if not mobile:
            raise ValueError('Mobile is required')
        if not email:
            raise ValueError('Email is required')
        if not full_name:
            raise ValueError('Full name is required')

        email = self.normalize_email(email)
        user = self.model(mobile=mobile, email=email, full_name=full_name, **extra)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, mobile, email, full_name, password=None, **extra):
        extra.setdefault('is_staff', True)
        extra.setdefault('is_superuser', True)
        extra.setdefault('is_mobile_verified', True)
        extra.setdefault('accepted_terms', True)
        if not password:
            raise ValueError('Superuser needs a password')
        return self.create_user(mobile, email, full_name, password, **extra)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(max_length=150)
    mobile = models.CharField(max_length=15, unique=True, db_index=True)
    email = models.EmailField(unique=True, db_index=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    pin_code = models.CharField(max_length=6, blank=True)
    accepted_terms = models.BooleanField(default=False)
    is_mobile_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'mobile'
    REQUIRED_FIELDS = ['email', 'full_name']

    class Meta:
        ordering = ['-date_joined']

    def __str__(self):
        return f'{self.full_name} ({self.mobile})'


class OTPPurpose(models.TextChoices):
    REGISTER = 'register', 'Register'
    LOGIN = 'login', 'Login'


class OTPCode(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mobile = models.CharField(max_length=15, db_index=True)
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=OTPPurpose.choices)
    is_used = models.BooleanField(default=False)
    attempts = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.mobile} / {self.purpose} / {self.code}'

    @property
    def is_expired(self):
        return timezone.now() >= self.expires_at
