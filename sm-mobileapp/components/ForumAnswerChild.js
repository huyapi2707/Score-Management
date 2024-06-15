import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { List, Avatar, Button } from "react-native-paper";
import globalStyle from "../styles/globalStyle";
import componentsStyles from "../styles/componentsStyle";
import formStyle from "../styles/formStyle";
import { apis, endpoint } from "../configs/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ForumAnswerChild = ({ forumAnswerId }) => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForumAnswers = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await apis(token).get(
          endpoint.forumAnswerChild(forumAnswerId)
        );
        setAnswers(response.data);
      } catch (error) {
        console.error("Error fetching forum answers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForumAnswers();
  }, [forumAnswerId]);

  const renderLoading = () => (
    <View style={[globalStyle.container, globalStyle.flexCenter]}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  return (
    <View style={globalStyle.margin}>
      <List.Section>
        <List.Subheader>Replies</List.Subheader>
        {loading ? (
          renderLoading()
        ) : (
          answers.map((answer) => (
            <View key={answer.id}>
              <List.Item
                title={`${answer.owner.first_name} ${answer.owner.last_name}`}
                description={answer.content}
                left={() => (
                  <Avatar.Image
                    size={56}
                    source={{ uri: answer.owner.avatar }}
                  />
                )}
                style={componentsStyles.listForumAnswer}
              />
            </View>
          ))
        )}
        <Button
          style={formStyle.right}
          // Add navigation logic or action here
        >
          Reply
        </Button>
      </List.Section>
    </View>
  );
};

export default ForumAnswerChild;
