from datetime import datetime

from celery import shared_task

from django.core.mail import send_mail

from .models import SandwichOrder


@shared_task
def send_sandwich_orders():
    unsent_orders = SandwichOrder.objects.filter(order_sent__isnull=True)

    for order in unsent_orders:
        send_mail(
            subject=f"New Sandwich Order: {order.sandwich_type}",
            message=f"Customer Name: {order.customer_name}\nSandwich Type: {order.sandwich_type}",
            from_email="noreply@example.com",
            recipient_list=["sandwichteam@gotrhythm.com"],
            fail_silently=False,
        )
        order.order_sent = datetime.now()
        order.save()
