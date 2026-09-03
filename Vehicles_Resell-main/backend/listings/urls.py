from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import VehicleListingViewSet

router = DefaultRouter()
router.register('', VehicleListingViewSet, basename='listing')

urlpatterns = [
    path('', include(router.urls)),
]
