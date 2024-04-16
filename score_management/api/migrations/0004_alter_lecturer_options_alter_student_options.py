# Generated by Django 4.2 on 2024-04-16 03:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_remove_lecturer_is_lecturer_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='lecturer',
            options={'permissions': [('lecturer', 'Has lecturer permissions')]},
        ),
        migrations.AlterModelOptions(
            name='student',
            options={'permissions': [('student', 'Has student permissions')]},
        ),
    ]