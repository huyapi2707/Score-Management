import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Text, List } from "react-native-paper";
import globalStyle from "../styles/globalStyle";
import { apis, endpoint } from "../configs/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import componentsStyles from "../styles/componentsStyle";
import formStyle from "../styles/formStyle";

const Forum = ({ route }) => {
  const [forumList, setForumList] = useState([]);
  const [error, setError] = useState(null);
  const courseId = route.params?.courseId;

  useEffect(() => {
    const fetchForumList = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await apis(token).get(endpoint.listForum(courseId));
        setForumList(response.data);
      } catch (error) {
        console.error("Error fetching forum list:", error);
        setError(
          "An error occurred while fetching the forum list. Please try again later."
        );
      }
    };

    fetchForumList();
  }, [courseId]);

  return (
    <ScrollView>
      <View>
        <View style={[globalStyle.flexCenter, globalStyle.margin]}>
          <Text variant="titleLarge">Forums</Text>
        </View>
        {error ? (
          <Text>{error}</Text>
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
              />
            ))}
          </List.Section>
        )}
      </View>
    </ScrollView>
  );
};

export default Forum;
