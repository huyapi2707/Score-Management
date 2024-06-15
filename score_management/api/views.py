from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import permissions as builtin_permission
<<<<<<< Updated upstream
from api.models import Course, User
from api import serializers, utils
=======
from api.models import Course, User, Forum, ForumAnswer, StudentJoinCourse, Lecturer, Student
from api import serializers, utils, permissions
>>>>>>> Stashed changes
from api import paginators


class CourseViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = serializers.CourseSerializer
<<<<<<< Updated upstream

    # permission_classes = [permissions.IsAuthenticated]
=======
    permission_classes = [builtin_permission.IsAuthenticated]

    # def get_permissions(self):
    #     if self.action in ['get_courses_by_lecturer','post_forum']:
    #         return [builtin_permission.IsAuthenticated()]
    #
    #     return [builtin_permission.AllowAny()]
    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            course_name = self.request.query_params.get('name')

            if course_name:
                queryset = queryset.filter(name__icontains=course_name)

        return queryset

    @action(methods=["get"], url_path='score', detail=True)
    def get_score(self, request, pk):
        score_set = self.get_object().students.all()

        paginator = paginators.StudentScorePaginator()
        paginated_result = paginator.paginate_queryset(score_set, request)
        if paginated_result is not None:
            serializered_result = serializers.StudentScoreDetailsSerializer(paginated_result, many=True)
            return paginator.get_paginated_response(serializered_result.data)
        return Response(serializers.StudentScoreDetailsSerializer(score_set, many=True).data, status.HTTP_200_OK)
>>>>>>> Stashed changes

    @action(methods=['get'], url_path='score_statistic', detail=True)
    def get_score_statistic(self, request, pk):
        result = utils.statistic_score_by_course_id(pk)
        return Response(result, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='all_scores', detail=True)
    def get_course_with_all_student_score(self, request, pk):
        query = utils.get_scores_data_by_course_id(pk)
        return Response(serializers.CourseWithStudentScoresSerializer(query).data, status=status.HTTP_200_OK)


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


<<<<<<< Updated upstream
=======
        student = request.user
        if not student.has_perm("api.student"):
            return Response("Not a student", status=status.HTTP_400_BAD_REQUEST)
        query = (StudentJoinCourse.objects
                 .filter(student=student)
                 .filter(course_id=course_id)
                 .first())
        serializer = serializers.StudentScoreSerializer
        return Response(serializer(query).data, status=status.HTTP_200_OK)


class ForumViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = Forum.objects.filter(is_active=True)
    serializer_class = serializers.ForumSerializer
    # permission_classes = [builtin_permission.IsAuthenticated]


    @action(methods=['get'], url_path='course/(?P<course_id>\d+)',url_name='list-forum', detail=False)
    def get_list_forum(self, request, course_id):
        course = Course.objects.get(pk=course_id)
        forums = course.forum_set.filter(is_active=True)
        serializer = serializers.ForumSerializer(forums, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='forum-answer-parents', detail=True)
    def post_forum_answer_parents(self, request, pk):
        f = self.get_object().forumanswer_set.create(content=request.data.get('content'),
                                                     owner=request.user)
        return Response(serializers.ForumAnswerSerializer(f).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], url_path='parent-answers')
    def get_parent_answers(self, request, pk=None):
            forum = self.get_object()
            parent_answers = ForumAnswer.objects.filter(forum=forum, parent=None)
            return Response(serializers.ForumAnswerSerializer(parent_answers, many=True).data, status=status.HTTP_200_OK)


class ForumAnswerViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = ForumAnswer.objects.all()
    serializer_class = serializers.ForumAnswerSerializer
    permission_classes = [permissions.AnswerOwner]

    @action(methods=['get'], url_path='parents-answer', detail=True)
    def get_parents_answer(self, request, forum_id):
        forum = Forum.objects.get(pk=forum_id)
        answer = self.get_object()
        parent_answer = answer.parent
        if parent_answer is None:
            serializer = serializers.ForumAnswerSerializer(parent_answer)
            return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='answers', url_name='forum-answer-child',detail=True)
    def post_forum_answer_child(self, request, pk=None):
        parent_answer = self.get_object()
        serializer = serializers.ForumAnswerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user, parent=parent_answer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], url_path='child-answers')
    def get_child_answers(self, request, pk=None):
            parent_answer = self.get_object()
            child_answers = ForumAnswer.objects.filter(parent=parent_answer)
            return Response(serializers.ForumAnswerSerializer(child_answers, many=True).data, status=status.HTTP_200_OK)
>>>>>>> Stashed changes
