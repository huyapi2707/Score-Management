from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import permissions as builtin_permission
from api.models import Course, User
from api import serializers, utils


class CourseViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = serializers.CourseSerializer

    # permission_classes = [permissions.IsAuthenticated]

    @action(methods=['get'], url_path='score_statistic', detail=True)
    def get_score_statistic(self, request, pk):
        result = utils.statistic_score_by_course_id(pk)
        return Response(result, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='all_scores', detail=True)
    def get_course_with_all_student_score(self, request, pk):
        query = utils.get_scores_data_by_course_id(pk)
        return Response(serializers.CourseWithStudentScoresSerializer(query).data, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ViewSet):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer

    permission_classes = [builtin_permission.IsAuthenticated]

    @action(methods=['get'], url_path='self', detail=False)
    def get_self_information(self, request):
        user = request.user
        return Response(serializers.UserSerializer(user).data, status=status.HTTP_200_OK)


    @action(methods=["get"], url_path="public", detail=True)
    def get_public_data(self, request, pk):
        user = User.objects.get(pk=pk)
        return Response(serializers.UserPublicInforSerializer(user).data, status=status.HTTP_200_OK)