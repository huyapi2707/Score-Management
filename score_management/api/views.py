from rest_framework import viewsets, generics, status, parsers, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from api.models import Course, User
from api import serializers


class CourseViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = serializers.CourseSerializer

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            q = self.request.query_params.get('q')
            if q:
                queryset = queryset.filter(name__icontains=q)

            lect_id = self.request.query_params.get('lecturer_id')
            if lect_id:
                queryset = queryset.filter(lecturer_id=lect_id)

        return queryset

    # permission_classes = [permissions.IsAuthenticated]
    #
    # def get_permissions(self):
    #     if self.action in ['score_statistic']:
    #         return self.permission_classes + [permissions.IsAdminUser]
    #     return self.permission_classes

    @action(methods=['get'], url_path='score_statistic', detail=True, name='score_statistic')
    def get_score_statistic(self, request, pk):
        pass

    @action(methods=['get'], url_path='course_detail', detail=True)
    def get_course_detail(self, request, pk):
        lessons = self.get_object().lesson_set.filter(active=True)

        q = request.query_params.get('q')
        if q:
            lessons = lessons.filter(subject__icontains=q)

        return Response(serializers.LessonSerializer(lessons, many=True).data,
                        status=status.HTTP_200_OK)



class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ['get_current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return Response(serializers.UserSerializer(user).data)

# class SubjectViewSet(viewsets):
