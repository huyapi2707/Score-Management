import React, { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { Button, Text } from "react-native-paper";
import globalStyle from "../styles/globalStyle";
import { apis, endpoint } from "../configs/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import formStyle from "../styles/formStyle";
import componentsStyles from "../styles/componentsStyle";
import ForumAnswer from "./ForumAnswer";
import CreateAnswer from "./CreateAnswer";

const ForumDetail = ({ route, navigation }) => {
  const { forumId } = route.params;
  const [forumDetail, setForumDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateAnswer, setShowCreateAnswer] = useState(false);

  const fetchForumDetail = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const response = await apis(token).get(endpoint.forumDetail(forumId));
      setForumDetail(response.data);
    } catch (error) {
      console.error("Error fetching forum detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForumDetail();
  }, []);

  const handleCreateAnswerSuccess = () => {
    setShowCreateAnswer(false);
    fetchForumDetail();
  };

  if (loading) {
    return (
      <View style={[globalStyle.container, globalStyle.flexCenter]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={globalStyle.container}>
      <View style={[globalStyle.flexCenter, globalStyle.margin]}>
        <Text variant="titleLarge">Forum Detail</Text>
      </View>
      <View style={globalStyle.margin}>
        <View style={componentsStyles.sectionTitle}>
          <Text style={formStyle.fontTitle} variant="titleLarge">
            {forumDetail?.title}
          </Text>
        </View>
        <View style={formStyle.right}>
          <Text style={formStyle.creatorText}>
            Creator: {forumDetail?.creator?.first_name}{" "}
            {forumDetail?.creator?.last_name}
          </Text>
        </View>
        <Text
          style={[formStyle.contentText, componentsStyles.contentTextForum]}
        >
          {forumDetail?.content}
        </Text>
      </View>
      <Button
        style={formStyle.right}
        onPress={() => setShowCreateAnswer(!showCreateAnswer)}
      >
        Answer
      </Button>

      {showCreateAnswer && <CreateAnswer forumId={forumDetail?.id} onCreateSuccess={handleCreateAnswerSuccess} />}

      <ForumAnswer forumId={forumDetail?.id} />
    </ScrollView>
  );
};

export default ForumDetail;
