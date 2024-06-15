import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Text, List, Button } from "react-native-paper";
import globalStyle from "../styles/globalStyle";
import { apis, endpoint } from "../configs/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import componentsStyles from "../styles/componentsStyle";
import formStyle from "../styles/formStyle";

const Forum = ({ courseId, navigation }) => {
  const [forumList, setForumList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchForumList = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await apis(token).get(endpoint.listForum(courseId));
      setForumList(response.data);
      setError(null);
    } catch (error) {
      console.error("Error creating forum:", error);

      setError(
        "An error occurred while fetching the forum list. Please try again later."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchForumList();
  }, [courseId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchForumList();
    });

    return unsubscribe;
  }, [navigation]);

  const handleCreateForum = () => {
    navigation.navigate("createforum", { courseId: courseId });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchForumList();
  };

  if (loading) {
    return (
      <View style={[globalStyle.container, globalStyle.flexCenter]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View>
        <View style={componentsStyles.buttonContainer}>

          <Button
            mode="contained"
            onPress={handleCreateForum}
            style={componentsStyles.smallButton}
            labelStyle={componentsStyles.buttonLabel}
          >
            New
          </Button>
        </View>
        {error ? (
          <Text>Loading...</Text>
        ) : (
          <List.Section>
            {forumList.map((forum) => (
                <List.Item
                  key={forum.id}
                  title={`Title: ${forum.title}`}
                  description={`Creator: ${forum.creator.first_name} ${forum.creator.last_name}`}
                  titleStyle={formStyle.fontTitle}
                  descriptionStyle={formStyle.fontCreator}
                  style={componentsStyles.listItemForum}
                  onPress={() => navigation.navigate("forumdetail", { forumId : forum.id })}
                />
            ))}
          </List.Section>
        )}
      </View>
    </ScrollView>
  );
};
export default Forum;