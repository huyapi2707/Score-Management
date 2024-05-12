from django.urls import path, re_path, include
from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register('courses', views.CourseViewSet, basename='courses')
router.register("users", views.UserViewSet, basename="users")
urlpatterns = [
    path('', include(router.urls)),
]