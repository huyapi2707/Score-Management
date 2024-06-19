import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { View, ScrollView } from "react-native";
import {
  Text,
  DataTable,
  Button,
  ActivityIndicator,
  Portal,
  Modal,
  Dialog,
  TextInput,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apis, endpoint } from "../configs/apis";
import ExportButtons from "../components/ExportButtons";
import Forum from "../components/Forum";
import globalStyle from "../styles/globalStyle";
import componentsStyles from "../styles/componentsStyle";
import { useFocusEffect } from "@react-navigation/native";
import { GlobalStoreContext } from "../configs/context";
import * as action from "../configs/actions";
const LecturerCourse = ({ route, navigation }) => {
  const course = route.params?.course;
  const [courseDetail, setCourseDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState(10);
  const [openAddColumn, setOpenAddColumn] = useState(false);
  const [newColumn, setNewColumn] = useState({});
  const [validateMessage, setValidateMessage] = useState(null);
  const totalPercentageRef = useRef(0);
  const globalStoreDispatcher = useContext(GlobalStoreContext);
  const [scoreColumns, setScoreColumn] = useState([]);

  const renderAddScoreColumnButton = () => {
    const columns = course["score_columns"];
    const totalPerncetage = columns.reduce((total, current) => {
      return (total += current["percentage"]);
    }, 0);
    totalPercentageRef.current = totalPerncetage;
    if (totalPerncetage < 1.0) {
      return (
        <View style={componentsStyles.buttonContainer}>
          <Button
            onPress={() => {
              setOpenAddColumn(true);
            }}
            icon={"clipboard-list"}
            mode="contained-tonal"
          >
            Add Columns
          </Button>
        </View>
      );
    }
  };
  useEffect(() => {
    setScoreColumn(course["score_columns"]);
  }, []);
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

  const handleAddColumn = async () => {
    if (!newColumn["name"] || newColumn["name"] === "") {
      setValidateMessage("Require fields column name");
      return;
    }
    if (!newColumn["percentage"]) {
      setValidateMessage("Require fields column percentage");
      return;
    }
    if (
      newColumn["percentage"] <= 0 ||
      newColumn["percentage"] > (1 - totalPercentageRef.current).toFixed(2)
    ) {
      setValidateMessage(
        `Percentage field must be greater than 0 and lower or equal  ${(
          1 - totalPercentageRef.current
        ).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      );
      return;
    }
    try {
      console.log(newColumn);
      globalStoreDispatcher(action.turnOnIndicator());
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await apis(accessToken).post(
        endpoint.courseScoreColumn(course["id"]),
        newColumn
      );
      if (response["status"] === 201) {
        setScoreColumn((scoreColumns) => [...scoreColumns, response["data"]]);
        globalStoreDispatcher(
          action.setSuccessAlert({
            title: "Score column",
            content: "Add score column successful",
          })
        );
      } else throw new Exception("Server error");
    } catch (ex) {
      globalStoreDispatcher(
        action.setErrorAlert({
          title: "Score column",
          content: "Can't create new score column",
        })
      );
      console.error(ex);
    } finally {
      setOpenAddColumn(false);
      setNewColumn({});
      setValidateMessage(null);
      globalStoreDispatcher(action.turnOffIndicator());
    }
  };

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
          <View style={componentsStyles.buttonContainer}>
            <ExportButtons courseId={courseDetail?.id} />
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
        <View>
          <View style={componentsStyles.sectionTitle}>
            <Text variant="titleMedium">SCORE COLUMNS</Text>
          </View>
          <DataTable style={globalStyle.scoreTable}>
            <DataTable.Header>
              <DataTable.Title style={componentsStyles.scoreTableTextStyle}>
                No
              </DataTable.Title>
              <DataTable.Title style={componentsStyles.scoreTableTextStyle}>
                Name
              </DataTable.Title>
              <DataTable.Title style={componentsStyles.scoreTableTextStyle}>
                Percentage
              </DataTable.Title>
            </DataTable.Header>
            {scoreColumns.map((col, index) => {
              return (
                <DataTable.Row key={index}>
                  <DataTable.Cell style={componentsStyles.scoreTableTextStyle}>
                    {index}
                  </DataTable.Cell>
                  <DataTable.Cell style={componentsStyles.scoreTableTextStyle}>
                    {col["name"]}
                  </DataTable.Cell>
                  <DataTable.Cell style={componentsStyles.scoreTableTextStyle}>
                    {col["percentage"]}
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable>
          {renderAddScoreColumnButton()}
        </View>
      </View>
      <Portal>
        <Dialog visible={openAddColumn}>
          <Dialog.Title>Add new score column</Dialog.Title>
          <Dialog.Content>
            <TextInput
              value={newColumn["name"]}
              onChangeText={(text) =>
                setNewColumn((newColumn) => {
                  setValidateMessage(null);
                  return {
                    ...newColumn,
                    name: text,
                  };
                })
              }
              mode="flat"
              label="Column name"
            />
            <TextInput
              onChangeText={(text) =>
                setNewColumn((newColumn) => {
                  setValidateMessage(null);
                  return {
                    ...newColumn,
                    percentage: parseFloat(text),
                  };
                })
              }
              value={new String(newColumn["percentage"])}
              keyboardType="numeric"
              mode="flat"
              label="Percentage"
            />
            <Text style={componentsStyles["errorMessage"]} variant="bodySmall">
              {validateMessage}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor="red" onPress={() => setOpenAddColumn(false)}>
              Cancel
            </Button>
            <Button onPress={handleAddColumn}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

export default LecturerCourse;
