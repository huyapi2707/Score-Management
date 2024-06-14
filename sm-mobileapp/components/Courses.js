import React, { useContext, useState, useEffect } from "react";
import { View, ActivityIndicator, TouchableOpacity } from "react-native";
import { List, Text, Searchbar } from "react-native-paper";
import componentsStyles from "../styles/componentsStyle";
import globalStyle from "../styles/globalStyle";
import { AuthenticationContext } from "../configs/context";
import { apis, endpoint } from "../configs/apis.js";
import moment from "moment";
import "moment/locale/vi";

const Courses = ({ navigation }) => {
  const { user } = useContext(AuthenticationContext);
  const [lecturerCourses, setLecturerCourses] = useState(null);
  const [loading, setLoading] = useState(false);
  const lecturerId = user.id;
  const accessToken = user.accessToken;
  const [searchCourse, setSearchCourse] = useState('');

  const loadLecturerCourses = async () => {
    let url = `${endpoint.coursesLecturer(lecturerId)}?name=${searchCourse}&subject_name=${searchCourse}`;
    try {
      setLoading(true);
      const res = await apis(accessToken).get(url);
      setLecturerCourses(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLecturerCourses();
  }, [searchCourse, lecturerId]);

  return (
    <View style={globalStyle.container}>
      <View style={[globalStyle.flexCenter, globalStyle.margin]}>
        <Text variant="titleLarge">Courses</Text>
      </View>

      <View style={globalStyle.margin}>
        <Searchbar
          placeholder="Search"
          value={searchCourse}
          onChangeText={(t) => setSearchCourse(t)}
        />
      </View>

      <View style={globalStyle.margin}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          lecturerCourses && (
            <List.Section>
              {lecturerCourses.map((course) => (
                <TouchableOpacity
                  key={course.id}
                  onPress={() =>
                    navigation.navigate("coursedetail", { courseId: course.id })
                  }
                >
                  <List.Item
                    title={`${course.name + " - " + course.subject.name.toUpperCase()}`}
                    description={moment(course.created_date).fromNow()}
                    left={(props) => (
                      <List.Icon {...props} icon="google-classroom" />
                    )}
                    style={componentsStyles.listCourse}
                  />
                </TouchableOpacity>
              ))}
            </List.Section>
          )
        )}
      </View>
    </View>
  );
};

export default Courses;
