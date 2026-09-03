import uuid

from django.conf import settings
from django.db import models


class VehicleListing(models.Model):
    class VehicleType(models.TextChoices):
        CAR = 'car', 'Car'
        BIKE = 'bike', 'Bike'
        SCOOTER = 'scooter', 'Scooter'
        COMMERCIAL = 'commercial', 'Commercial'
        OTHER = 'other', 'Other'

    class FuelType(models.TextChoices):
        PETROL = 'petrol', 'Petrol'
        DIESEL = 'diesel', 'Diesel'
        CNG = 'cng', 'CNG'
        ELECTRIC = 'electric', 'Electric'
        HYBRID = 'hybrid', 'Hybrid'
        OTHER = 'other', 'Other'

    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        ACTIVE = 'active', 'Active'
        SOLD = 'sold', 'Sold'
        ARCHIVED = 'archived', 'Archived'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='listings',
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    vehicle_type = models.CharField(
        max_length=20,
        choices=VehicleType.choices,
        default=VehicleType.CAR,
    )
    brand = models.CharField(max_length=100)
    model_name = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    fuel_type = models.CharField(
        max_length=20,
        choices=FuelType.choices,
        default=FuelType.PETROL,
    )
    kilometers = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=6, blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} — {self.brand} {self.model_name}'
