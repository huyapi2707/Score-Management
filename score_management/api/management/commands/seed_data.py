from datetime import datetime, timedelta
import random

from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand

from django_seed import Seed
from django_seed.providers import Provider

from api.models import Configuration, Lecturer, Subject, Student, Course, ScoreColumn, StudentJoinCourse, \
    StudentScoreDetail

subject_name = ["math", "physic", "science", "chemistry", "art", "english", "philosophy", "geography", "history", "biology"]
default_base_domain = "gmail.com"

def generate_course_name(key):
    return f'{key}-{random.randint(1000,9999)}'



class Command(BaseCommand):
    help("Seed the database")
    def handle(self, *args, **options):
        seeder = Seed.seeder(locale="en-us")

        seeder.add_entity(Configuration, 1, {
            'max_score_columns_quantity': 5,
            "base_domain": default_base_domain,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        })

        seeder.add_entity(Lecturer, 10, {
            "avatar": "https://res.cloudinary.com/ddgtjayoj/image/upload/v1712811626/rgntl7vnb09zu1ieemk5.jpg",
            "last_login": None,
            "password": make_password("lecturer"),
            "is_superuser": False,
            "is_staff": False,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "email": seeder.faker.email(domain=default_base_domain)

        })

        seeder.add_entity(Student, 200, {
            "avatar": "https://res.cloudinary.com/ddgtjayoj/image/upload/v1712811626/rgntl7vnb09zu1ieemk5.jpg",
            "password": make_password("student"),
            "is_superuser": False,
            "is_staff": False,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "last_login": None
        })

        seeder.add_entity(Subject, 10, {
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "name": lambda x: subject_name.pop()
        })
        seeder.add_entity(Course, 10, {
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "start_date": datetime.now(),
            "end_date": datetime.now() + timedelta(weeks=12),
            "name": lambda x : generate_course_name("A")
        })
        seeder.add_entity(ScoreColumn, 10, {
            "name": "mid-term",
            "percentage": 0.5,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        })
        seeder.add_entity(ScoreColumn, 10, {
            "name": "end-term",
            "percentage": 0.5,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        })

        seeder.add_entity(StudentJoinCourse, 300, {
            "joined_date": datetime.now()
        })
        seeder.add_entity(StudentScoreDetail, 500, {
            "score": lambda x : random.randint(5, 10)
        })
        seeder.execute()
        self.stdout.write(self.style.SUCCESS('Database seeded successfully'))