import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { List, Avatar, Button } from "react-native-paper";
import globalStyle from "../styles/globalStyle";
import componentsStyles from "../styles/componentsStyle";
import formStyle from "../styles/formStyle";
import { apis, endpoint } from "../configs/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ForumAnswerChild from "./ForumAnswerChild";
import CreateAnswerChild from "./CreateAnswerChild";

const ForumAnswer = ({ forumId }) => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [showCreateAnswer, setShowCreateAnswer] = useState(false);
  const [activeAnswerId, setActiveAnswerId] = useState(null);

  const fetchForumAnswers = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await apis(token).get(
        endpoint.forumAnswerParent(forumId)
      );
      setAnswers(response.data);
    } catch (error) {
      console.error("Error fetching forum answers:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchForumAnswers();
  }, [forumId]);

  const handleCreateAnswerSuccess = async () => {
    // setShowCreateAnswer(false);
    setActiveAnswerId(null);
    fetchForumAnswers();
  };

  const toggleCreateAnswer = (id) => {
    setActiveAnswerId(activeAnswerId === id ? null : id);
  };

  const renderLoading = () => (
    <View style={[globalStyle.container, globalStyle.flexCenter]}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  return loading ? (
    renderLoading()
  ) : (
    <View>
      <List.Section>
        <List.Subheader>Answers</List.Subheader>
        {answers.map((answer) => (
          <View key={answer.id}>
            <List.Item
              title={`${answer.owner.first_name} ${answer.owner.last_name}`}
              description={answer.content}
              left={() => (
                <Avatar.Image size={56} source={{ uri: answer.owner.avatar }} />
              )}
              style={componentsStyles.listForumAnswer}
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

export default ForumAnswer;
