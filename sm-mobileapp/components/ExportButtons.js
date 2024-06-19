import React from "react";
import { Button } from "react-native-paper";
import { Alert } from "react-native";
import RNFS from "react-native-fs";
import { writeFile } from "react-native-csv";
import { apis, endpoint } from "../configs/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import componentsStyles from "../styles/componentsStyle";
const ExportButton = ({ courseId }) => {
  const exportToCSV = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await apis(accessToken).get(
        endpoint.courseStudentAllScore(courseId)
      );
      const courseDetail = response.data;
      const csvData = [
        ["No", "ID", "Name", "Mid", "End", "Final"],
        ...courseDetail.students.map((student, index) => [
          index + 1,
          student.student.id,
          `${student.student.first_name} ${student.student.last_name}`,
          student.scores.find((score) => score.name === "mid-term").score,
          student.scores.find((score) => score.name === "end-term").score,
          student.summary_score,
        ]),
      ];
      const csvString = csvData.map((row) => row.join(",")).join("\n");
      const downloadDirectoryPath = RNFS.DownloadDirectoryPath;
      const filePath = `${downloadDirectoryPath}/courseDetail.csv`;

      await RNFS.writeFile(filePath, csvString, "utf8");
      console.log("CSV file saved to " + filePath);
      Alert.alert(
        "Success",
        `CSV file for Course ${courseDetail.name} saved to ${filePath}`
      );
    } catch (error) {
      console.error("Error writing CSV file:", error);
      Alert.alert("Error", "Failed to export CSV file");
    }
  };

  return (
    <Button icon="file-download" mode="contained-tonal" onPress={exportToCSV}>
      Export CSV
    </Button>
  );
};

export default ExportButton;
