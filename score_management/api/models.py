from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField
from django.core import validators
from ckeditor.fields import RichTextField


student_permission = []
lecturer_permission = []


class BaseModel(models.Model):
    class Meta:
        abstract = True

    created_at = models.DateTimeField(auto_now=True, null=False)
    updated_at = models.DateTimeField(auto_now_add=True, null=False)
    is_active = models.BooleanField(default=True)


class Configuration(BaseModel):
    max_score_columns_quantity = models.IntegerField(null=False, default=5,
                                                     validators=[validators.MinValueValidator(2)])
    base_domain = models.CharField(null=False, default="gmail.com")

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        if Configuration.objects.first() is not None:
            raise ValidationError("Configuration is existing")


class User(AbstractUser):
    avatar = CloudinaryField(null=True)
    created_at = models.DateTimeField(auto_now=True, null=False)
    updated_at = models.DateTimeField(auto_now_add=True, null=False)
    gender = models.BooleanField(null=True)

class Student(User):
    class Meta:
        proxy = True
        permissions = student_permission


class Lecturer(User):
    class Meta:
        proxy = True
        permissions = []


class Subject(BaseModel):
    name = models.CharField(null=False, unique=True, max_length=255)
    pass


class Course(BaseModel):
    name = models.CharField(null=False, unique=True, max_length=255)
    start_date = models.DateField(null=False)
    end_date = models.DateField(null=False)
    subject = models.ForeignKey(Subject, on_delete=models.RESTRICT, related_name="courses")
    lecturer = models.ForeignKey(Lecturer, on_delete=models.DO_NOTHING, related_name="teaching_courses")


class ScoreColumn(BaseModel):
    name = models.CharField(null=False, max_length=255)
    percentage = models.FloatField(null=False,
                                   validators=[validators.MinValueValidator(0.1), validators.MaxValueValidator(1.0)], )
    course = models.ForeignKey(Course, on_delete=models.RESTRICT, related_name="score_columns")

    def save(self, *args, **kwargs):
        self.percentage = round(self.percentage, 2)
        super(ScoreColumn, self).save(*args, **kwargs)


class StudentJoinCourse(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="join_course")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="students")
    joined_date = models.DateTimeField(null=False, auto_now=True)


class StudentScoreDetail(models.Model):
    student_join_course = models.ForeignKey(StudentJoinCourse, on_delete=models.DO_NOTHING, related_name="scores")
    score = models.FloatField(null=False,
                              validators=[validators.MinValueValidator(0.0), validators.MaxValueValidator(10.0)])
    score_column = models.ForeignKey(ScoreColumn, null=False, related_name="+", on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        self.score = round(self.score, 2)
        super(StudentScoreDetail, self).save(*args, **kwargs)


class Forum(BaseModel):
    content = RichTextField()
    creator = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=False, related_name="creating_forums")


class ForumAnswer(BaseModel):
    content = RichTextField()
    owner = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=False, related_name="answer_forums")
    parent = models.ForeignKey('ForumAnswer', on_delete=models.CASCADE, null=True, related_name="children")
