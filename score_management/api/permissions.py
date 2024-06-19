from rest_framework import permissions

class UserOwnerPermission(permissions.IsAuthenticated):

    def has_object_permission(self, request, view, user):
        return super().has_permission(request, view) and request.user == user

class AnswerOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, answer):
        return super().has_permission(request, view) and request.user == answer.owner


class StudentPermission(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        user = request.user
        return super().has_permission(request, view) and user.has_perm("api.student")

class LecturerPermission(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        user = request.user
        return super().has_permission(request, view) and user.has_perm("api.lecturer")

