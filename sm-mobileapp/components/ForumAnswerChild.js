import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { List, Avatar, Button } from "react-native-paper";
import globalStyle from "../styles/globalStyle";
import componentsStyles from "../styles/componentsStyle";
import formStyle from "../styles/formStyle";
import { apis, endpoint } from "../configs/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateAnswerChild from "./CreateAnswerChild";

const ForumAnswerChild = ({ forumAnswerId }) => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAnswerId, setActiveAnswerId] = useState(null);

  const fetchForumAnswerChild = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await apis(token).get(
        endpoint.forumAnswerChild(forumAnswerId)
      );
      setAnswers(response.data);
    } catch (error) {
      console.error("Error fetching forum answers:", error);
      Alert.alert("Error", "Failed to load answers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForumAnswerChild();
  }, [forumAnswerId]);

  const handleCreateAnswerSuccess = async () => {
    setActiveAnswerId(null);
    fetchForumAnswerChild();
  };

  const toggleCreateAnswer = (id) => {
    setActiveAnswerId(activeAnswerId === id ? null : id);
  };

  const renderLoading = () => (
    <View style={[globalStyle.container, globalStyle.flexCenter]}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  return (
    <View style={globalStyle.marginLeft}>
      <List.Section>
        {loading
          ? renderLoading()
          : answers.map((answer) => (
              <View key={answer.id}>
                <List.Subheader>{`Reply to: ${answer.parent_content}`}</List.Subheader>
                <List.Item
                  title={`${answer.owner.first_name} ${answer.owner.last_name}`}
                  description={answer.content}
                  left={() => (
                    <Avatar.Image
                      size={56}
                      source={{ uri: answer.owner.avatar }}
                    />
                  )}
                  style={[componentsStyles.listForumAnswer]}
                />
                <Button
                  style={formStyle.right}
                  onPress={() => toggleCreateAnswer(answer.id)}
                >
                  Reply
                </Button>

                {activeAnswerId === answer.id && (
                  <CreateAnswerChild
                    answerId={answer.id}
                    onCreateSuccess={handleCreateAnswerSuccess}
                  />
                )}
                <ForumAnswerChild forumAnswerId={answer.id} />
              </View>
            ))}
      </List.Section>
    </View>
  );
};

export default ForumAnswerChild;
