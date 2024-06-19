import React, { useState } from 'react';
import { View, Alert, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { apis, endpoint } from '../configs/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import formStyle from '../styles/formStyle';

const CreateAnswer = ({ forumId, onCreateSuccess }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createAnswer = async () => {
    try {
      if (!content) {
        setError("Content cannot be empty");
        return;
      }
      setLoading(true);
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await apis(accessToken).post(endpoint.createAnswer(forumId), {
        content
      });
      if (response.status === 201) {
        Alert.alert("Success", "Answer has been created successfully");
        setContent("");
        onCreateSuccess(); 
      } else {
        setError("Failed to create answer");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={formStyle.formCreate}>
      <TextInput
        mode="outlined"
        label="Content"
        value={content}
        onChangeText={setContent}
        multiline
      />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Button
        mode="contained"
        onPress={createAnswer}
        disabled={!content}
        style={{ marginTop: 10 }}
        loading={loading}
      >
        Send
      </Button>
    </View>
  );
};

export default CreateAnswer;
