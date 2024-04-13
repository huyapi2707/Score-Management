
import cloudinary

from django.contrib import admin
from django.contrib.auth.hashers import make_password
from api import serializers
from django.template.response import TemplateResponse
from django.urls import reverse, path
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django import forms


from api import utils
from api.models import User, Subject, Course, StudentJoinCourse, Configuration


# Register your models here.


class BaseAdmin(admin.ModelAdmin):
    search_fields = ["id", "name"]


class UserAdminForm(forms.ModelForm):
    class Meta:
        model = User
        fields = '__all__'
        exclude = ['last_login', 'is_superuser', 'groups', 'is_staff']

    def save(self, commit=True):
        user = super(UserAdminForm, self).save(commit=False)
        user.password = make_password(user.password)
        if commit:
            user.save()
        return user


class UserAdmin(admin.ModelAdmin):
    search_fields = ['id', 'first_name', 'last_name', 'email']
    list_display = ['id', 'first_name', 'last_name', 'email', 'gender', 'created_at', 'updated_at']
    readonly_fields = ['image']
    list_per_page = 100
    form = UserAdminForm

    def image(self, obj):
        if obj.avatar:
            if type(obj.avatar) is cloudinary.CloudinaryResource:
                return mark_safe(f"<img width='300' src='{obj.avatar.url}' />")
            return mark_safe(f"<img width='300' src='/static/{obj.avatar.name}' />")


class CourseStudentInline(admin.TabularInline):
    model = StudentJoinCourse
    readonly_fields = ['student_id', 'joined_date', 'first_name', 'last_name', 'email', 'gender', 'created_at',
                       'updated_at']
    can_delete = True
    exclude = ['id']
    verbose_name = "Students join this course"

    def student_id(self, obj):
        return obj.student_id

    def first_name(self, obj):
        return obj.student.first_name

    def last_name(self, obj):
        return obj.student.last_name

    def email(self, obj):
        return obj.student.email

    def gender(self, obj):
        return "Male" if obj.student.gender else "Female"

    def created_at(self, obj):
        return obj.student.created_at

    def updated_at(self, obj):
        return obj.student.updated_at


class SubjectAdmin(BaseAdmin):
    list_display = ["id", "name", "created_at", "updated_at", "is_active"]


class CourseAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "subject", "lecturer", "created_at", "updated_at", "is_active", ]

    def subject(self, obj):
        link = reverse("admin:api_subject_change", args=[obj.subject_id])
        return format_html('<a href="{}">{}</a>', link, obj.subject)

    def lecturer(self, obj):
        link = reverse("admin:api_user_change", args=[obj.lecturer_id])
        return format_html('<a href="{}">{}</a>', link, obj.lecturer)

    inlines = [CourseStudentInline]

class ConfigurationAdmin(admin.ModelAdmin):
    list_display = ['max_score_columns_quantity', 'base_domain']

    def has_delete_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False

class ScoreManagementAdminSite(admin.AdminSite):
    site_header = "Score management administrator"



    def get_urls(self):
        return [
            path('course-statistic/', self.admin_view(self.course_stat_view), name='Course statistic')
        ] + super().get_urls()

    def course_stat_view(self, request):
        course_list = Course.objects.values('id', 'name').filter(is_active=True)

        scores_data = utils.get_scores_data_by_course_id(1)

        context = dict(
            self.each_context(request),
            course_list = course_list,
            scores_data= serializers.CourseWithStudentScoresSerializer(scores_data).data
        )

        return TemplateResponse(request, 'admin/course-statistic.html', context)

    def get_app_list(self, request, app_label=None):
        app_list = super().get_app_list(request)
        app_list += [
            {
                "name": "Other actions",
                "app_label": "custom_app",
                "models": [
                    {
                        "name": "Course statistic",
                        "label": "course_statistic",
                        "admin_url": "/admin/course-statistic",
                        "view_only": True
                    }
                ]
            }
        ]
        return app_list

admin_site = ScoreManagementAdminSite(name="Score Management")

admin_site.register(User, UserAdmin)
admin_site.register(Subject, SubjectAdmin)
admin_site.register(Course, CourseAdmin)
admin_site.register(Configuration, ConfigurationAdmin)

