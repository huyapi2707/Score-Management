from rest_framework import permissions

class AnswerOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, answer):
        return super().has_permission(request, view) and request.user == answer.owner