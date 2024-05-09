from api.models import Course
from django.db import connection

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



