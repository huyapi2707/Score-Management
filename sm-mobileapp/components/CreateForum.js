import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apis, endpoint } from "../configs/apis";
import globalStyle from "../styles/globalStyle";
import formStyle from "../styles/formStyle";
import EditorScreen from "./EditorScreen";

const CreateForum = ({ route, navigation }) => {
  const courseId = route.params?.courseId;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(true);

  const createForum = async () => {
    if (!title || !content) {
      Alert.alert("Title and content cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await apis(accessToken).post(endpoint.forum(courseId), {
        title,
        content,
      });

      if (response.status === 201) {
        Alert.alert("Success", "Forum has been created successfully", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert("Failed to create forum");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRichTextMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
  };

  return (
    <View style={globalStyle.container}>
      <View style={[globalStyle.flexCenter, globalStyle.margin]}>
        <Text variant="titleLarge">Create Forum</Text>
      </View>
      <View style={formStyle.formCreate}>
        <TextInput
          mode="outlined"
          label="Title"
          value={title}
          onChangeText={setTitle}
        />
        {isAdvancedMode ? (
          <TextInput
            mode="outlined"
            label="Content"
            multiline
            value={content}
            onChangeText={setContent}
          />
        ) : (
          <EditorScreen
            content={content}
            setContent={setContent}
            isAdvancedMode={isAdvancedMode}
            />
        )}
        <Button style={formStyle.right} onPress={() => toggleRichTextMode()}>
          {isAdvancedMode ? "Advance" : "Basic"}
        </Button>
        <Button
          mode="contained"
          onPress={createForum}
          disabled={loading || !title || !content}
          style={{ marginTop: 10 }}
          loading={loading}
        >
          Create
        </Button>
      </View>
    </View>
  );
};

export default CreateForum;
