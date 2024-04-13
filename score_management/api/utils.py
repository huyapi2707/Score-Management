from api.models import Course


def get_scores_data_by_course_id(id):
    try:
        result = (Course.objects
                  .prefetch_related("students__student")
                  .prefetch_related("students__scores")
                  .prefetch_related("students__scores__score_column").get(pk=id))

        print(result)
        return result
    except Exception as e:
        print(e)
        return None
