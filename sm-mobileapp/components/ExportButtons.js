import React from 'react';
import { Button, View, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import { writeFile } from 'react-native-csv';

const ExportButtons = ({ courseDetail }) => {
  const exportToCSV = async () => {
    const csvData = [
      ['No', 'ID', 'Name', 'Mid', 'End', 'Final'],
      ...courseDetail.students.map((student, index) => [
        index + 1,
        student.student.id,
        `${student.student.first_name} ${student.student.last_name}`,
        student.scores.find(score => score.name === 'mid-term').score,
        student.scores.find(score => score.name === 'end-term').score,
        student.summary_score,
      ]),
    ];

    const csvString = csvData.map(row => row.join(',')).join('\n');

    const downloadDirectoryPath = RNFS.DownloadDirectoryPath;
    const filePath = `${downloadDirectoryPath}/courseDetail.csv`; 

    try {
      await RNFS.writeFile(filePath, csvString, 'utf8');
      console.log('CSV file saved to ' + filePath);
      Alert.alert('Success', `CSV file saved to ${filePath}`);
    } catch (error) {
      console.error('Error writing CSV file:', error);
      Alert.alert('Error', 'Failed to export CSV file');
    }
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
      <Button title="Export CSV" onPress={exportToCSV} />
    </View>
  );
};

export default ExportButtons;
