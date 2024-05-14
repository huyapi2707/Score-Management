from rest_framework import pagination


class UserPaginator(pagination.PageNumberPagination):
    page_size = 5
