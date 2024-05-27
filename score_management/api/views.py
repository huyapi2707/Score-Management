from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import permissions as builtin_permission
from api.models import Course, User,Lecturer
from api import serializers, utils
from api import paginators


class CourseViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = serializers.CourseSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            q = self.request.query_params.get('q')
            if q:
                queryset = queryset.filter(name__icontains=q)

        return queryset

    @action(methods=['get'], url_path='score_statistic', detail=True)
    def get_score_statistic(self, request, pk):
        result = utils.statistic_score_by_course_id(pk)
        return Response(result, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='all_scores', detail=True)
    def get_course_with_all_student_score(self, request, pk):
        query = utils.get_scores_data_by_course_id(pk)
        return Response(serializers.CourseWithStudentScoresSerializer(query).data, status=status.HTTP_200_OK)

    ##   Giảng viên xem danh sách các lớp học mà mình giảng dạy.
    @action(methods=['get'], detail=True, url_path='lecturer_courses')
    def get_courses_by_lecturer(self, request, pk=None):
        try:
            lecturer = Lecturer.objects.get(pk=pk)
            courses = Course.objects.filter(lecturer=lecturer)
            return Response(serializers.CourseSerializer(courses,many=True).data, status=status.HTTP_200_OK)
        except Lecturer.DoesNotExist:
            return Response({"error": "Lecturer not found"}, status=status.HTTP_404_NOT_FOUND)


class UserViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    pagination_class = paginators.UserPaginator
    permission_classes = [builtin_permission.IsAuthenticated]

    @action(methods=['get'], url_path='self', detail=False)
    def get_self_information(self, request):
        user = request.user
        return Response(serializers.UserSerializer(user).data, status=status.HTTP_200_OK)

    @action(methods=["get"], url_path="public", detail=True)
    def get_public_data(self, request, pk):
        user = User.objects.get(pk=pk)
        return Response(serializers.UserPublicInforSerializer(user).data, status=status.HTTP_200_OK)

    @action(methods=["get"], url_path="public/list", detail=False)
    def get_public_data_list(self, request):
        q = request.query_params.get("q")

        users = None
        if q:

            users = User.objects.filter(username__icontains=q).filter(is_active=True)
        else:
            users = User.objects.filter().filter(is_active=True)
        paginator = paginators.UserPaginator()
        serializer = serializers.UserPublicInforSerializer
        paginated_data = paginator.paginate_queryset(users, request)
        if paginated_data is not None:
            return paginator.get_paginated_response(serializer(paginated_data, many=True).data)
        return Response(serializer(users, many=True).data, status=status.HTTP_200_OK)


