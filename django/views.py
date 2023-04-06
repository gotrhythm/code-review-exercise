from rest_framework import viewsets

from .models import SandwichOrder
from .serializers import SandwichOrderSerializer


class SandwichOrderViewSet(viewsets.ModelViewSet):
    queryset = SandwichOrder.objects.all()
    serializer_class = SandwichOrderSerializer
