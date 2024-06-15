const { View, StyleSheet } = require("react-native");

import { Text, DataTable } from "react-native-paper";
import globalStyle from "../styles/globalStyle";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext, GlobalStoreContext } from "../configs/context";
import componentsStyles from "../styles/componentsStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apis, endpoint } from "../configs/apis";
import * as actions from "../configs/actions";
const StudentCourse = ({ route }) => {
  const { user } = useContext(AuthenticationContext);
  const globalStoreDispatcher = useContext(GlobalStoreContext);
  const course = route.params?.course;
  const [userScore, setUserScore] = useState({
    scores: [],
    summary_score: "",
  });
  const loadStudentScore = async () => {
    try {
      globalStoreDispatcher(actions.turnOnIndicator());
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await apis(accessToken).get(
        endpoint.studentScore(course["id"])
      );
      setUserScore(response["data"]);
    } catch (ex) {
      console.error(ex);
    } finally {
      globalStoreDispatcher(actions.turnOffIndicator());
    }
  };
  useEffect(() => {
    loadStudentScore();
  }, []);
  return (
    <View>
      <View style={[globalStyle.flexCenter, globalStyle.margin]}>
        <Text variant="titleLarge">Class: {course.name}</Text>
      </View>
      <View style={globalStyle.margin}>
        <Text variant="bodyLarge">
          Lecturer: {course.lecturer.first_name} {course.lecturer.last_name}
        </Text>
        <Text style={globalStyle.textCamel} variant="bodyLarge">
          Subject: {course.subject.name}
        </Text>
      </View>
      <View>
        <View style={componentsStyles["sectionTitle"]}>
          <Text variant="titleMedium">SCORE</Text>
        </View>
        <DataTable style={globalStyle["scoreTable"]}>
          <DataTable.Header>
            {userScore["scores"].map((s, index) => (
              <DataTable.Title
                style={componentsStyles["scoreTableTextStyle"]}
                key={index}
              >
                {s["name"]}
              </DataTable.Title>
            ))}
            <DataTable.Title style={componentsStyles["scoreTableTextStyle"]}>
              summary
            </DataTable.Title>
          </DataTable.Header>
          <DataTable.Row>
            {userScore["scores"].map((s, index) => (
              <DataTable.Cell
                style={componentsStyles["scoreTableTextStyle"]}
                key={index}
              >
                {s["score"]}
              </DataTable.Cell>
            ))}
            <DataTable.Cell style={componentsStyles["scoreTableTextStyle"]}>
              {userScore["summary_score"]}
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </View>
      <View>
        <View style={componentsStyles["sectionTitle"]}>
          <Text variant="titleMedium">FORUM</Text>
        </View>
      </View>
    </View>
  );
};

export default StudentCourse;
