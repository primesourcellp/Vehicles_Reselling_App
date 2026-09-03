from django.contrib import admin

from .models import VehicleListing


@admin.register(VehicleListing)
class VehicleListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'brand', 'model_name', 'year', 'price', 'city', 'status', 'seller')
    list_filter = ('status', 'vehicle_type', 'fuel_type')
    search_fields = ('title', 'brand', 'model_name', 'seller__mobile')
