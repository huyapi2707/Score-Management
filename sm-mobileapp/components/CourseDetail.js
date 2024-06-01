import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { DataTable, Text, ActivityIndicator } from "react-native-paper";
import globalStyle from "../styles/globalStyle";
import { AuthenticationContext, GlobalStoreContext } from "../configs/context";
import { apis, endpoint } from "../configs/apis";
import ExportButtons from "./ExportButtons.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as utils from "../configs/utils.js";

const CourseDetail = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const courseId = route.params?.courseId;
  const [course, setCourse] = useState(null);
  const [scoreList, setScoreList] = useState([]);
  const [page, setPage] = useState(1);
  const loadCourseDetail = async () => {
    try {
      setLoading(true);
      const accessToken = await AsyncStorage.getItem("accessToken");
      const res = await apis(accessToken).get(endpoint.courseDetail(courseId));
      setCourse(res["data"]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadScore = async () => {
    if (page === -1) {
      return;
    }
    try {
      setLoading(true);
      const accessToken = await AsyncStorage.getItem("accessToken");
      console.log(page, loading);
      const res = await apis(accessToken).get(
        endpoint.courseStudentScore(courseId) + `?page=${page}`
      );
      setScoreList((scoreList) => [...scoreList, ...res["data"]["results"]]);
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
    if (
      utils.isCloseToBottom(nativeEvent) &&
      loading === false &&
      page !== -1
    ) {
      setPage((page) => page + 1);
    }
  };

  useEffect(() => {
    loadScore();
  }, [page]);

  useEffect(() => {
    if (courseId) {
      loadCourseDetail();
    }
  }, []);

  return (
    <View style={globalStyle.container}>
      <View style={[globalStyle.flexCenter, globalStyle.margin]}>
        <Text variant="titleLarge">Course Detail</Text>
      </View>
      <View style={globalStyle.margin}>
        {course && (
          <>
            <Text variant="bodyLarge">Class: {course.name}</Text>
            <Text variant="bodyLarge">
              Lecturer: {course.lecturer.first_name} {course.lecturer.last_name}
            </Text>
            <Text style={globalStyle.textCamel} variant="bodyLarge">
              Subject: {course.subject.name}
            </Text>
            <ExportButtons courseDetail={course} />
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
                      {
                        student.scores.find(
                          (score) => score.name === "mid-term"
                        ).score
                      }
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {
                        student.scores.find(
                          (score) => score.name === "end-term"
                        ).score
                      }
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      {student.summary_score}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
              <ActivityIndicator animating={loading} />
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
};

export default CourseDetail;
