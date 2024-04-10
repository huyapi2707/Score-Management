from django.urls import path, re_path, include
from rest_framework import routers
from api import views

router = routers.DefaultRouter()


urlpatterns = [
    path('', include(router.urls)),
]