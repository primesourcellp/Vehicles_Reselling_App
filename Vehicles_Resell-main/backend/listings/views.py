from rest_framework import permissions, viewsets

from .models import VehicleListing
from .serializers import VehicleListingSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.seller_id == request.user.id


class VehicleListingViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        qs = VehicleListing.objects.select_related('seller')
        status_filter = self.request.query_params.get('status')
        mine = self.request.query_params.get('mine')
        city = self.request.query_params.get('city')

        if mine in ('1', 'true', 'yes') and self.request.user.is_authenticated:
            return qs.filter(seller=self.request.user)

        if status_filter:
            qs = qs.filter(status=status_filter)
        elif self.action == 'list':
            qs = qs.filter(status=VehicleListing.Status.ACTIVE)

        if city:
            qs = qs.filter(city__iexact=city)

        return qs

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)
