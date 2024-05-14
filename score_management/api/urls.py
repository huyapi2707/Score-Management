from django.urls import path, re_path, include
from rest_framework import routers
from api import views

router = routers.DefaultRouter()
router.register('courses', views.CourseViewSet, basename='courses')
router.register('users', views.UserViewSet, basename='users')
router.register('forums', views.ForumViewSet, basename='forums')
router.register('forumanswers', views.ForumAnswerViewSet, basename='forumanswers')


router.register("users", views.UserViewSet, basename="users")
urlpatterns = [
    path('', include(router.urls)),
]