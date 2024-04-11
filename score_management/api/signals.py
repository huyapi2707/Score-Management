# signals.py
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.core.management import call_command

@receiver(post_migrate)
def seed_data(sender, **kwargs):
        if sender.name == "api":
            print(sender.name)
            call_command('seed_data')