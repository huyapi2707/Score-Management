from django.shortcuts import render
from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import action

from api.models import Course
from api import serializers


class CourseViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = serializers.CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['score_statistic']:
            return self.permission_classes + [permissions.IsAdminUser]
        return self.permission_classes

    @action(methods=['get'], url_path='score_statistic', detail=True, name='score_statistic')
    def get_score_statistic(self, request, pk):
        pass

# Create your views here.
