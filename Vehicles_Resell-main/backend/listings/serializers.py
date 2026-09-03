from rest_framework import serializers

from .models import VehicleListing


class VehicleListingSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.full_name', read_only=True)
    seller_mobile = serializers.CharField(source='seller.mobile', read_only=True)

    class Meta:
        model = VehicleListing
        fields = (
            'id',
            'seller',
            'seller_name',
            'seller_mobile',
            'title',
            'description',
            'vehicle_type',
            'brand',
            'model_name',
            'year',
            'fuel_type',
            'kilometers',
            'price',
            'city',
            'state',
            'pin_code',
            'status',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'seller', 'created_at', 'updated_at')
