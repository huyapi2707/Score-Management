import json

from api.firebase import firebase_database
from api.models import Course, User, ChatKey, Lecturer
from django.db import connection
from datetime import datetime
from django.contrib.auth.models import Permission

def get_scores_data_by_course_id(id):
    try:
        result = (Course.objects
                  .prefetch_related("students__student")
                  .prefetch_related("students__scores")
                  .prefetch_related("students__scores__score_column").get(pk=id))

        return result
    except Exception as e:
        print(e)
        return None

def get_scores_data_by_course_by_lecturer_id(id):
    lecturer = Permission.objects.get(codename='lecturer')
    try:

        result = (Course.objects
                  .prefetch_related("students__student")
                  .prefetch_related("students__scores")
                  .prefetch_related("students__scores__score_column").get(pk=id))

        return result
    except Exception as e:
        print(e)
        return None


def send_message(sender_id, receiver_id, message):
    sender = User.objects.get(pk=sender_id)
    receiver = User.objects.get(pk=receiver_id)

    if sender == None or receiver == None:
        return None

    chat_key = ChatKey.objects.filter(sender_id=sender_id).filter(receiver_id=receiver_id).first()

    if chat_key is not None:
        key = chat_key.key

        data = {
            "message": message,
            "sender_id": sender_id,
            "timestamp": datetime.now().timestamp() * 1000
        }
        (firebase_database
         .child('chats')
         .child(key)
         .child("messages")
         .push(data))

        receiver_unread = firebase_database.child('user_key').child(receiver_id).child(key).child("unread").get().val()
        newUnread = 1
        if receiver_unread is not None:
            newUnread += int(receiver_unread)
        firebase_database.child('user_key').child(receiver_id).child(key).update({"unread": newUnread})

        return chat_key
    else:
        data = {
            "message": message,
            "sender_id": sender_id,
            "timestamp": datetime.now().timestamp() * 1000
        }

        key = firebase_database.generate_key()

        firebase_database.child("chats").child(f'{key}/messages').push(data)

        firebase_database.child("user_key").child(sender_id).child(key).set(
            {"unread": 0, "opponent_id": receiver_id})
        firebase_database.child("user_key").child(receiver_id).child(key).set(
            {"unread": 1, "opponent_id": sender_id})
        chat_key = ChatKey(sender=sender, receiver=receiver, key=key)
        chat_key.save()

        return chat_key


def statistic_score_by_course_id(id):
    print(id)
    sql = "SELECT api_scorecolumn.name, SUM(CASE WHEN api_studentscoredetail.score < 5 THEN 1 ELSE 0 END) AS BAD, SUM(CASE WHEN api_studentscoredetail.score BETWEEN 5 AND 8 THEN 1 ELSE 0 END) AS AVERAGE, SUM(CASE WHEN api_studentscoredetail.score > 8 THEN 1 ELSE 0 END) AS GOOD FROM api_course JOIN api_studentjoincourse ON api_course.id = api_studentjoincourse.course_id JOIN api_studentscoredetail ON api_studentjoincourse.id = api_studentscoredetail.student_join_course_id JOIN api_scorecolumn ON api_studentscoredetail.score_column_id = api_scorecolumn.id WHERE api_course.id = %s GROUP BY  api_scorecolumn.name"
    with connection.cursor() as cursor:
        cursor.execute(sql, [id])
        result = []
        for row in cursor.fetchall():
            name, bad, average, good = row
            result.append({
                'name': name,
                'bad': bad.__str__(),
                'average': average.__str__(),
                'good': good.__str__()
            })

        return result
