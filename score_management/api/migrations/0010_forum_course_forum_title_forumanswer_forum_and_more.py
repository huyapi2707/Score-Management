# Generated by Django 4.2 on 2024-05-28 18:30

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_chatkey_key'),
    ]

    operations = [
        migrations.AddField(
            model_name='forum',
            name='course',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.course'),
        ),
        migrations.AddField(
            model_name='forum',
            name='title',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='forumanswer',
            name='forum',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.forum'),
        ),
        migrations.AlterField(
            model_name='forumanswer',
            name='content',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='forumanswer',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answer_forums', to=settings.AUTH_USER_MODEL),
        ),
    ]
