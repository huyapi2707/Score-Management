from django.contrib.auth.models import Permission
from django.db.models import  Sum, F
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from api.models import User, Course, ScoreColumn, StudentJoinCourse, StudentScoreDetail, Subject, Forum, ForumAnswer, \
    ChatKey, Student, Configuration
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django import forms


class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()


    def create(self, validated_data):
        data = validated_data.copy()
        configuration = Configuration.objects.first()
        if not data.get("email").endswith(configuration.base_domain):
            raise ValidationError("Email domain doesn't excepted")
        student = Student(**data)
        student.set_password(student.password)
        student.save()
        student_permission = Permission.objects.get(codename='student')
        student.user_permissions.add(student_permission)

        return student

    def validate_email(self, data):

        existed_user = User.objects.filter(email=data)
        if existed_user:
            raise ValidationError("Email is existed")
        else:
            return data



    def get_role(self, instance):

        if instance.has_perm('api.lecturer'):
            return "lecturer"
        if instance.has_perm('api.student'):
            return "student"

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.avatar:
            rep['avatar'] = instance.avatar.url
        else:
            rep['avatar'] = 'https://res.cloudinary.com/ddgtjayoj/image/upload/v1712811626/rgntl7vnb09zu1ieemk5.jpg'
        return rep

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username','password', 'avatar', 'gender', 'role']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

class UserPublicInforSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.avatar:
            rep['avatar'] = instance.avatar.url
        else:
            rep['avatar'] = 'https://res.cloudinary.com/ddgtjayoj/image/upload/v1712811626/rgntl7vnb09zu1ieemk5.jpg'
        return rep
    class Meta:
        model = User
        fields = ['username', 'avatar', 'id', 'first_name', 'last_name']


class UserChatKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatKey
        fields = ['key', 'sender_id']


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']


class ScoreColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoreColumn
        fields = ['id', 'name', 'percentage']




class CourseSerializer(serializers.ModelSerializer):
    lecturer = UserSerializer()
    subject = SubjectSerializer()
    score_columns = ScoreColumnSerializer(many=True)

    class Meta:
        model = Course
        fields = ['id', 'name', 'created_at', 'updated_at', 'lecturer', 'subject', 'score_columns']


class ScoreDetailSerializer(serializers.ModelSerializer):

    name = serializers.SerializerMethodField()

    def get_name(self, obj):
        return obj.score_column.name
    class Meta:
        model = StudentScoreDetail
        fields = ['score', 'name']



class StudentScoreDetailsSerializer(serializers.ModelSerializer):

    student = UserSerializer()
    scores = ScoreDetailSerializer(many=True)

    summary_score = serializers.SerializerMethodField()

    def get_summary_score(self, obj):
        return obj.scores.annotate(p=F('score') * F('score_column__percentage')).aggregate(total=Sum('p'))['total']
    class Meta:
        model = StudentJoinCourse
        fields = ['student', 'scores', 'summary_score']

class StudentScoreSerializer(serializers.ModelSerializer):
    scores = ScoreDetailSerializer(many=True)

    summary_score = serializers.SerializerMethodField()

    def get_summary_score(self, obj):
        return obj.scores.annotate(p=F('score') * F('score_column__percentage')).aggregate(total=Sum('p'))['total']

    class Meta:
        model = StudentJoinCourse
        fields = ['scores', 'summary_score']


class CourseWithStudentScoresSerializer(CourseSerializer):
    students = StudentScoreDetailsSerializer(many=True)
    total_student = serializers.SerializerMethodField()

    def get_total_student(self, obj):

        return obj.students.count()
    class Meta:
        model = CourseSerializer.Meta.model
        fields = CourseSerializer.Meta.fields + ['students', 'total_student']

class ForumForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorUploadingWidget())
    class Meta:
        model = Forum
        fields = ['title', 'content']


class ForumSerializer(serializers.ModelSerializer):
    form = ForumForm
    creator = UserSerializer()
    course = CourseSerializer()
    class Meta:
        model = Forum
        fields = '__all__'




class ForumAnswerSerializer(serializers.ModelSerializer):
    owner = UserSerializer()
    parent_content = serializers.CharField(source='parent.content', read_only=True)
    class Meta:
        model = ForumAnswer
        fields = '__all__'
