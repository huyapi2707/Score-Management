from rest_framework import viewsets, generics, status, parsers, permissions
from rest_framework import pagination
from rest_framework.decorators import action
from rest_framework.response import Response

from api.models import Course, User, Forum, ForumAnswer, StudentJoinCourse
from api import serializers, utils, perms
from rest_framework import permissions as builtin_permission
from api import paginators


class CourseViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
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

    def get_permissions(self):
        if self.action in ['create-forum']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='score_statistic', detail=True)
    def get_score_statistic(self, request, pk):
        result = utils.statistic_score_by_course_id(pk)
        return Response(result, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='all_scores', detail=True)
    def get_course_with_all_student_score(self, request, pk):
        query = utils.get_scores_data_by_course_id(pk)
        return Response(serializers.CourseWithStudentScoresSerializer(query).data, status=status.HTTP_200_OK)

    # Tạo forum
    @action(methods=['post'], url_path='create-forum', detail=True)
    def post_forum(self, request, pk):
        f = self.get_object().forum_set.create(title=request.data.get('title'),content=request.data.get('content'),
                                                 creator=request.user)
        return Response(serializers.ForumSerializer(f).data, status=status.HTTP_201_CREATED)


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


class ForumViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = Forum.objects.filter(is_active=True)
    serializer_class = serializers.ForumSerializer
    def get_permissions(self):
        if self.action in ['add_forum_answer']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['post'], url_path='forum-answer', detail=True)
    def add_forum_answer(self, request, pk):
        f = self.get_object().forumanswer_set.create(content=request.data.get('content'),
                                                 owner=request.user)
        return Response(serializers.ForumAnswerSerializer(f).data, status=status.HTTP_201_CREATED)


class ForumAnswerViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = ForumAnswer.objects.all()
    serializer_class = serializers.ForumAnswerSerializer
    permission_classes = [perms.AnswerOwner]


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


