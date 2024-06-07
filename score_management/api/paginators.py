from rest_framework import pagination


class UserPaginator(pagination.PageNumberPagination):
    page_size = 5


class StudentScorePaginator(pagination.PageNumberPagination):
    page_size = 15


class CoursePaginator(pagination.PageNumberPagination):
    page_size = 10