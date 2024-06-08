import React, { useContext, useState, useEffect } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Text, Searchbar, List } from "react-native-paper";
import componentsStyles from "../styles/componentsStyle";
import globalStyle from "../styles/globalStyle";
import { GlobalStoreContext } from "../configs/context";
import { apis, endpoint } from "../configs/apis.js";
import moment from "moment";
import "moment/locale/vi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as action from "../configs/actions.js";
import * as utils from "../configs/utils.js";
const Courses = ({ navigation }) => {
  const globalStoreDispatcher = useContext(GlobalStoreContext);
  const [courses, setCourses] = useState([]);
  const [kw, setKw] = useState("");
  const [page, setPage] = useState(1);
  const loadCourse = async () => {
    if (page < 1) {
      return;
    }
    const accessToken = await AsyncStorage.getItem("accessToken");

    try {
      globalStoreDispatcher(action.turnOnIndicator());

      const res = await apis(accessToken).get(
        endpoint["userCourses"] + `?kw=${kw}&page=${page}`
      );
      if (res["data"]["next"] === null) {
        setPage(-1);
      }
      setCourses((courses) => [...courses, ...res["data"]["results"]]);
    } catch (error) {
      console.error(error);
    } finally {
      globalStoreDispatcher(action.turnOffIndicator());
    }
  };

  const handleLoadMore = ({ nativeEvent }) => {
    if (utils.isCloseToBottom(nativeEvent) && page > 0) {
      setPage((page) => page + 1);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [kw]);

  return (
    <View style={globalStyle.container}>
      <View style={[globalStyle.flexCenter, globalStyle.margin]}>
        <Text variant="titleLarge">Courses</Text>
      </View>

      <View style={globalStyle.margin}>
        <Searchbar
          placeholder="Search"
          value={kw}
          onChangeText={(value) => {
            setKw(value);
            setPage(1);
          }}
        />
      </View>

      <ScrollView onScroll={handleLoadMore} style={globalStyle.margin}>
        <List.Section>
          {courses.map((course) => (
            <TouchableOpacity
              key={course.id}
              onPress={() =>
                navigation.navigate("userCourse", { course: course })
              }
            >
              <List.Item
                title={`${
                  course.name + " - " + course.subject.name.toUpperCase()
                }`}
                description={moment(course.created_date).fromNow()}
                left={(props) => (
                  <List.Icon {...props} icon="google-classroom" />
                )}
                style={componentsStyles.listCourse}
              />
            </TouchableOpacity>
          ))}
        </List.Section>
      </ScrollView>
    </View>
  );
};

export default Courses;
