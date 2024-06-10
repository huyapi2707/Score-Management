import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text, DataTable, Button } from "react-native-paper";
import globalStyle from "../styles/globalStyle";
import componentsStyles from "../styles/componentsStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apis, endpoint } from "../configs/apis";
import { AuthenticationContext, GlobalStoreContext } from "../configs/context";
import * as actions from "../configs/actions";
import ExportButtons from "../components/ExportButtons";

const LecturerCourse = ({ route, navigation }) => {
  const { user } = useContext(AuthenticationContext);
  const globalStoreDispatcher = useContext(GlobalStoreContext);
  const course = route.params?.course;
  const [courseDetail, setCourseDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCourseDetail = async () => {
    try {
      globalStoreDispatcher(actions.turnOnIndicator());
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await apis(accessToken).get(
        endpoint.courseDetail(course.id)
      );
      setCourseDetail(response.data);
    } catch (ex) {
      console.error(ex);
    } finally {
      globalStoreDispatcher(actions.turnOffIndicator());
    }
  };

  useEffect(() => {
    loadCourseDetail();
  }, []);

  return (
    <ScrollView>
      <View>
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
        <View style={componentsStyles.buttonContainer}>
          <ExportButtons courseId={courseDetail?.id} />
          <Button
            mode="contained"
            onPress={() =>
              navigation.navigate("forum", { courseId: course.id })
            }
            style={componentsStyles.smallButton}
            labelStyle={componentsStyles.buttonLabel}
          >
            Forum
          </Button>
        </View>

        <View>
          <View style={componentsStyles["sectionTitle"]}>
            <Text variant="titleMedium">SCORE</Text>
          </View>
          <DataTable style={globalStyle["scoreTable"]}>
            <DataTable.Header>
              <DataTable.Title style={componentsStyles["scoreTableTextStyle"]}>
                No
              </DataTable.Title>
              <DataTable.Title
                style={[componentsStyles["scoreTableTextStyle"], { flex: 3 }]}
              >
                Name
              </DataTable.Title>
              {courseDetail?.students[0]?.scores.map((s, index) => (
                <DataTable.Title
                  style={componentsStyles["scoreTableTextStyle"]}
                  key={index}
                >
                  {s.name}
                </DataTable.Title>
              ))}
              <DataTable.Title style={componentsStyles["scoreTableTextStyle"]}>
                Summary
              </DataTable.Title>
            </DataTable.Header>
            {courseDetail?.students.map((student, rowIndex) => (
              <DataTable.Row key={rowIndex}>
                <DataTable.Cell style={componentsStyles["scoreTableTextStyle"]}>
                  {rowIndex + 1}
                </DataTable.Cell>
                <DataTable.Cell
                  style={[componentsStyles["scoreTableTextStyle"], { flex: 3 }]}
                >
                  {`${student.student.first_name} ${student.student.last_name}`}
                </DataTable.Cell>
                {student.scores.map((score, colIndex) => (
                  <DataTable.Cell
                    style={componentsStyles["scoreTableTextStyle"]}
                    key={colIndex}
                  >
                    {score.score}
                  </DataTable.Cell>
                ))}
                <DataTable.Cell style={componentsStyles["scoreTableTextStyle"]}>
                  {student.summary_score}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </View>
        <View>
          <View style={componentsStyles["sectionTitle"]}>
            <Text variant="titleMedium">FORUM</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default LecturerCourse;
