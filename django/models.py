from django.db import models


class SandwichOrder(models.Model):
    customer_name = models.CharField(max_length=100)
    sandwich_type = models.CharField(max_length=100)
    order_sent = models.DateTimeField(null=True, blank=True)


class Sandwich(models.Model):
    toppings = models.ArrayField()
    meat = models.CharField(max_length=100, choices=)
