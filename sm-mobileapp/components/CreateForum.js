import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apis, endpoint } from "../configs/apis";
import globalStyle from "../styles/globalStyle";
import formStyle from "../styles/formStyle";

const CreateForum = ({ route, navigation }) => {
  const courseId = route.params?.courseId;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createForum = async () => {
    if (!title || !content) {
      setError("Title and content cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      const response = await apis(accessToken).post(endpoint.forum(courseId), {
        title,
        content,
      });

      if (response.status === 201) {
        Alert.alert("Success", "Forum has been created successfully", [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]);
      } else {
        setError("Failed to create forum");
      }
    } catch (error) {
      console.error("Error creating forum:", error);
      setError("Error creating forum: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyle.container}>
      <View style={[globalStyle.flexCenter, globalStyle.margin]}>
        <Text variant="titleLarge">Create Forum</Text>
      </View>
      {error && <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>}
      <View style={formStyle.formCreate}>
        <TextInput
          mode="outlined"
          label="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          mode="outlined"
          label="Content"
          multiline
          value={content}
          onChangeText={setContent}
        />
        <Button
          mode="contained"
          onPress={createForum}
          disabled={loading || !title || !content}
          style={{marginTop:10}}
          loading={loading}
        >
          Create
        </Button>
      </View>
    </View>
  );
};

export default CreateForum;
