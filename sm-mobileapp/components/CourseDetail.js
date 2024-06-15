import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView, Button } from "react-native";
import { DataTable, Text, ActivityIndicator } from "react-native-paper";
import globalStyle from "../styles/globalStyle";
import { apis, endpoint } from "../configs/apis";
import ExportButtons from "./ExportButtons.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as utils from "../configs/utils.js";
import { AuthenticationContext } from "../configs/context";

const CourseDetail = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [scoreList, setScoreList] = useState([]);
  const [page, setPage] = useState(1);
  const { user } = useContext(AuthenticationContext);

  const course = route.params?.course;
  const courseId = route.params?.courseId;
  const accessToken = user?.accessToken;

  const loadScore = async () => {
    if (page === -1) return;

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      const res = await apis(token).get(
        endpoint.courseStudentScore(course["id"]) + `?page=${page}`
      );
      setScoreList((prevScoreList) => [...prevScoreList, ...res["data"]["results"]]);
      if (res["data"]["next"] === null) {
        setPage(-1);
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = ({ nativeEvent }) => {
    if (utils.isCloseToBottom(nativeEvent) && !loading && page !== -1) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    loadScore();
  }, [page]);

  return (
    <View style={globalStyle.container}>
      <View style={[globalStyle.flexCenter, globalStyle.margin]}>
        <Text variant="titleLarge">Class: {course.name}</Text>
      </View>
      <View style={globalStyle.margin}>
        {course && (
          <>
            <Text variant="bodyLarge">
              Lecturer: {course.lecturer.first_name} {course.lecturer.last_name}
            </Text>
            <Text style={globalStyle.textCamel} variant="bodyLarge">
              Subject: {course.subject.name}
            </Text>
            <Button
              title="Create Forum"
              onPress={() =>
                navigation.navigate("forum", {
                  courseId: courseId,
                  accessToken: accessToken,
                  user: user,
                })
              }
            />
            <ExportButtons courseId={course["id"]} />
            <ScrollView onScroll={handleScroll} style={globalStyle.margin}>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>No</DataTable.Title>
                  <DataTable.Title>ID</DataTable.Title>
                  <DataTable.Title style={{ flex: 3 }}>Name</DataTable.Title>
                  <DataTable.Title numeric>Mid</DataTable.Title>
                  <DataTable.Title numeric>End</DataTable.Title>
                  <DataTable.Title numeric>Final</DataTable.Title>
                </DataTable.Header>
                {scoreList.map((student, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell>{index + 1}</DataTable.Cell>
                    <DataTable.Cell>{student.student.id}</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 3 }}>
                      {student.student.first_name} {student.student.last_name}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {student.scores.find((score) => score.name === "mid-term").score}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {student.scores.find((score) => score.name === "end-term").score}
                    </DataTable.Cell>
                    <DataTable.Cell numeric>{student.summary_score}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
              {loading && <ActivityIndicator animating />}
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
};

export default CourseDetail;
