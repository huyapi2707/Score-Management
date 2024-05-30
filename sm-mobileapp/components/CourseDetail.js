import React, { useContext, useState, useEffect } from "react";
import { View, ActivityIndicator, ScrollView } from "react-native";
import { DataTable, Text } from "react-native-paper";
import globalStyle from "../styles/globalStyle";
import { AuthenticationContext } from "../configs/context";
import { apis, endpoint } from "../configs/apis";
import ExportButtons from "./ExportButtons.js";

const CourseDetail = ({ route }) => {
  const { user } = useContext(AuthenticationContext);
  const [courseDetail, setCourseDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const courseId = route.params?.courseId;
  const accessToken = user.accessToken;

  const loadCourseDetail = async () => {
    try {
      setLoading(true);
      const res = await apis(accessToken).get(endpoint.courseDetail(courseId));
      setCourseDetail(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      loadCourseDetail();
    }
  }, [courseId]);

  return (
    <View style={globalStyle.container}>
      <View style={[globalStyle.flexCenter, globalStyle.margin]}>
        <Text variant="titleLarge">Course Detail</Text>
      </View>
      <View style={globalStyle.margin}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          courseDetail && (
            <>
              <Text variant="bodyLarge">Class: {courseDetail.name}</Text>
              <Text variant="bodyLarge">Lecturer: {courseDetail.lecturer.first_name} {courseDetail.lecturer.last_name}</Text>
              <Text variant="bodyLarge">Subject: {courseDetail.subject.name}</Text>
              <ExportButtons courseDetail={courseDetail} />
              <ScrollView>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>No</DataTable.Title>
                    <DataTable.Title>ID</DataTable.Title>
                    <DataTable.Title style={{ flex: 3 }}>Name</DataTable.Title>
                    <DataTable.Title numeric>Mid</DataTable.Title>
                    <DataTable.Title numeric>End</DataTable.Title>
                    <DataTable.Title numeric>Final</DataTable.Title>
                  </DataTable.Header>
                  {courseDetail.students.map((student, index) => (
                    <DataTable.Row key={student.student.id}>
                      <DataTable.Cell>{index + 1}</DataTable.Cell>
                      <DataTable.Cell>{student.student.id}</DataTable.Cell>
                      <DataTable.Cell style={{ flex: 3 }}>{student.student.first_name} {student.student.last_name}</DataTable.Cell>
                      <DataTable.Cell numeric>{student.scores.find(score => score.name === 'mid-term').score}</DataTable.Cell>
                      <DataTable.Cell numeric>{student.scores.find(score => score.name === 'end-term').score}</DataTable.Cell>
                      <DataTable.Cell numeric>{student.summary_score}</DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>
              </ScrollView>
            </>
          )
        )}
      </View>
    </View>
  );
};

export default CourseDetail;
