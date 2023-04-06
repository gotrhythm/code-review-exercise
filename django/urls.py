from rest_framework.routers import DefaultRouter

from django.urls import path

from .views import SandwichOrderViewSet

router = DefaultRouter()
router.register(r"sandwich_orders", SandwichOrderViewSet, basename="sandwich_order")
urlpatterns = router.urls
