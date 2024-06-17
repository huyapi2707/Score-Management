import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, ScrollView } from "react-native";
import { Text, DataTable, Button, ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apis, endpoint } from "../configs/apis";
import { AuthenticationContext } from "../configs/context";
import ExportButtons from "../components/ExportButtons";
import Forum from "../components/Forum";
import globalStyle from "../styles/globalStyle";
import componentsStyles from "../styles/componentsStyle";
import { useFocusEffect } from "@react-navigation/native";

const LecturerCourse = ({ route, navigation }) => {
  const { user } = useContext(AuthenticationContext);
  const course = route.params?.course;
  const [courseDetail, setCourseDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(10);

  useFocusEffect(
    useCallback(() => {
      const loadCourseDetail = async () => {
        if (!course) return;

        setLoading(true);
        try {
          const accessToken = await AsyncStorage.getItem("accessToken");
          const response = await apis(accessToken).get(
            endpoint.courseDetail(course.id),
            {
              params: { page, rowsPerPage: numberOfItemsPerPage },
            }
          );
          setCourseDetail(response.data);
        } catch (error) {
          console.error("Error fetching course details:", error);
        } finally {
          setLoading(false);
        }
      };

      loadCourseDetail();
    }, [course, page, numberOfItemsPerPage])
  );

  const handleChangePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage) => {
    setNumberOfItemsPerPage(newItemsPerPage);
    setPage(0);
  }, []);

  const from = page * numberOfItemsPerPage;
  const to = Math.min(
    (page + 1) * numberOfItemsPerPage,
    courseDetail?.students?.length || 0
  );

  return (
    <ScrollView>
      <View style={[globalStyle.flexCenter, globalStyle.margin]}>
        <Text variant="titleLarge">Course: {courseDetail?.name}</Text>
      </View>
      <View style={globalStyle.margin}>
        <Text variant="bodyLarge">
          Lecturer: {courseDetail?.lecturer.first_name}{" "}
          {courseDetail?.lecturer.last_name}
        </Text>
        <Text style={globalStyle.textCamel} variant="bodyLarge">
          Subject: {courseDetail?.subject.name}
        </Text>
      </View>

      <View>
        <View>
          <View style={componentsStyles.buttonContainer}>
            <ExportButtons courseId={courseDetail?.id} />
          </View>
          <View>
            <View style={componentsStyles.sectionTitle}>
              <Text variant="titleMedium">SCORES</Text>
            </View>
            {loading ? (
              <ActivityIndicator animating={true} size="large" />
            ) : (
              <DataTable style={globalStyle.scoreTable}>
                <DataTable.Header>
                  <DataTable.Title style={componentsStyles.scoreTableTextStyle}>
                    No
                  </DataTable.Title>
                  <DataTable.Title
                    style={[componentsStyles.scoreTableTextStyle, { flex: 3 }]}
                  >
                    Name
                  </DataTable.Title>
                  {courseDetail?.students[0]?.scores.map((s, index) => (
                    <DataTable.Title
                      style={componentsStyles.scoreTableTextStyle}
                      key={index}
                    >
                      {s.name}
                    </DataTable.Title>
                  ))}
                  <DataTable.Title style={componentsStyles.scoreTableTextStyle}>
                    Summary
                  </DataTable.Title>
                </DataTable.Header>
                {courseDetail?.students
                  .slice(from, to)
                  .map((student, rowIndex) => (
                    <DataTable.Row key={rowIndex}>
                      <DataTable.Cell
                        style={componentsStyles.scoreTableTextStyle}
                      >
                        {from + rowIndex + 1}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={[
                          componentsStyles.scoreTableTextStyle,
                          { flex: 3 },
                        ]}
                      >
                        {`${student.student.first_name} ${student.student.last_name}`}
                      </DataTable.Cell>
                      {student.scores.map((score, colIndex) => (
                        <DataTable.Cell
                          style={componentsStyles.scoreTableTextStyle}
                          key={colIndex}
                        >
                          {score.score}
                        </DataTable.Cell>
                      ))}
                      <DataTable.Cell
                        style={componentsStyles.scoreTableTextStyle}
                      >
                        {student.summary_score}
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}
              </DataTable>
            )}
            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(
                courseDetail?.students?.length / numberOfItemsPerPage
              )}
              onPageChange={handleChangePage}
              label={`${from + 1}-${to} of ${courseDetail?.students?.length}`}
              showFastPaginationControls
              numberOfItemsPerPage={numberOfItemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              selectPageDropdownLabel={"Rows per page"}
            />
          </View>
        </View>
        <View>
          <View style={componentsStyles.sectionTitle}>
            <Text variant="titleMedium">FORUM</Text>
          </View>
          {courseDetail?.id && (
            <Forum courseId={courseDetail.id} navigation={navigation} />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default LecturerCourse;
