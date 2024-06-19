import React, { useRef } from "react";
import {
  Text,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import componentsStyles from "../styles/componentsStyle";

const EditorScreen = ({ content, setContent }) => {
  const handleHead = ({ tintColor }) => (
    <Text style={{ color: tintColor }}>H1</Text>
  );
  const richText = useRef();
  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <RichEditor
            ref={richText}
            initialContentHTML={content}
            onChange={(text) => setContent(text)}
            placeholder="Content"
            style={componentsStyles.contentRichText}
          />
        </KeyboardAvoidingView>
      </ScrollView>
      <RichToolbar
        editor={richText}
        actions={[
          actions.insertImage,
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.heading1,
          actions.setUnderline,
          actions.undo,
          actions.redo,
        ]}
        iconMap={{
          [actions.heading1]: handleHead,
        }}
      />
    </SafeAreaView>
  );
};

export default EditorScreen;
