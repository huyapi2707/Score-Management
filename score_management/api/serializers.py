from django.db.models import Sum, F
from rest_framework import serializers
from api.models import User, Course, ScoreColumn, StudentJoinCourse, StudentScoreDetail, Subject, Forum, ForumAnswer
from ckeditor.fields import RichTextField
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django import forms


class UserSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['avatar'] = instance.avatar.url

        return rep

    def create(self, validated_data):
        data = validated_data.copy()

        user = User(**data)
        user.set_password(data["password"])
        user.save()

        return user

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'avatar']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


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


class CourseWithStudentScoresSerializer(CourseSerializer):
    students = StudentScoreDetailsSerializer(many=True)
    total_student = serializers.SerializerMethodField()

    def get_total_student(self, obj):
        return obj.students.count()

    class Meta:
        model = CourseSerializer.Meta.model
        fields = CourseSerializer.Meta.fields + ['students', 'total_student']

class ForumForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorUploadingWidget)
    class Meta:
        model = Forum
        fields = ['id','title','content','creator','course']

class ForumSerializer(serializers.ModelSerializer):
    form = ForumForm
    creator = UserSerializer()
    course = CourseSerializer()
    class Meta:
        model = Forum
        fields = ['id', 'title', 'content','creator','course', 'created_at']



class ForumAnswerSerializer(serializers.ModelSerializer):
    owner = UserSerializer()
    class Meta:
        model = ForumAnswer
        fields = ['id', 'content', 'owner', 'created_at']
