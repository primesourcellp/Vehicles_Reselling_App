from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import OTPCode, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ('-date_joined',)
    list_display = ('mobile', 'email', 'full_name', 'city', 'is_mobile_verified', 'is_staff')
    list_filter = ('is_mobile_verified', 'is_staff', 'is_active', 'accepted_terms')
    search_fields = ('mobile', 'email', 'full_name')
    fieldsets = (
        (None, {'fields': ('mobile', 'password')}),
        ('Personal info', {'fields': ('full_name', 'email', 'city', 'state', 'pin_code')}),
        (
            'Status',
            {
                'fields': (
                    'accepted_terms',
                    'is_mobile_verified',
                    'is_active',
                    'is_staff',
                    'is_superuser',
                    'groups',
                    'user_permissions',
                )
            },
        ),
        ('Dates', {'fields': ('date_joined', 'last_login')}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('mobile', 'email', 'full_name', 'password1', 'password2', 'is_staff'),
            },
        ),
    )
    readonly_fields = ('date_joined', 'last_login')


@admin.register(OTPCode)
class OTPCodeAdmin(admin.ModelAdmin):
    list_display = ('mobile', 'code', 'purpose', 'is_used', 'attempts', 'expires_at', 'created_at')
    list_filter = ('purpose', 'is_used')
    search_fields = ('mobile',)
