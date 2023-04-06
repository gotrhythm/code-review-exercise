from rest_framework import serializers

from .models import SandwichOrder


class SandwichOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SandwichOrder
        fields = ["id", "customer_name", "sandwich_type", "order_sent"]
