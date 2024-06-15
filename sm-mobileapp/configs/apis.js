import axios from "axios";

const baseUrl = "http://192.168.1.2:8000";

const endpoint = {
  auth: "/o/token/",
  userInfor: "/users/self/",
  userCourses: "/users/courses/",
  userViewset: "/users/",
  userPublicInfor: (id) => `/users/${id}/public/`,
  userPublicInforList: (q) => `/users/public/list?q=${q}`,
  user: (id) => `/users/${id}/`,
  coursesLecturer: (courseId) => `/courses/${courseId}/lecturer_courses/`,
  courseDetail: (courseId) => `/courses/${courseId}/`,
  courseStudentScore: (courseId) => `/courses/${courseId}/score`,
  courseStudentAllScore: (courseId) => `/courses/${courseId}/all_scores/`,
  studentScore: (courseId) => `/users/self/student/${courseId}/score`,
  courseDetail: (courseId) => `/courses/${courseId}/all_scores/`,
  forum: (courseId) => `/courses/${courseId}/create_forum/`,
  listForum: (courseId) => `/forums/course/${courseId}/`,
  forumDetail: (forumId) => `/forums/${forumId}/`, 
  forumAnswerParrent: (forumId) => `forums/${forumId}/parent-answers`,
  forumAnswerChild: (forumAnswerId) => `forumanswers/${forumAnswerId}/child-answers`,
};

const apis = (accessToken) => {
  if (accessToken) {
    return axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  }

  return axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export { endpoint, apis, baseUrl };
