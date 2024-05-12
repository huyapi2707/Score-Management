import {
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
  KeyboardAvoidingView,
} from "react-native";
import globalStyle from "../styles/globalStyle";
import { Text, Avatar, TextInput, Icon, List } from "react-native-paper";
import { useContext, useEffect, useRef, useState } from "react";
import { firebase } from "@react-native-firebase/database";
import moment from "moment";
import componentsStyles from "../styles/componentsStyle";
import { AuthenticationContext, GlobalStoreContext } from "../configs/context";
import * as action from "../configs/actions";
import { useHeaderHeight } from "@react-navigation/elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const Chat = ({ route }) => {
  const { infor } = route.params;
  const messageKey = useRef(Object.keys(infor)[0]);
  const heaederHeight = useHeaderHeight();
  const [messages, setMessages] = useState({});
  const messageRef = useRef(null);
  const globalStoreDispatcher = useContext(GlobalStoreContext);
  const { user } = useContext(AuthenticationContext);
  const [newMessage, setNewMessage] = useState("");
  const { height } = useWindowDimensions();
  useEffect(() => {
    globalStoreDispatcher(action.turnOnIndicator());
    try {
      if (messageRef.current !== null) {
        return;
      }
      if (messageKey.current === "admin") {
        messageRef.current = firebase
          .app()
          .database(
            "https://lms-chats-default-rtdb.asia-southeast1.firebasedatabase.app/"
          )
          .ref("/announcements/");
      } else {
        messageRef.current = firebase
          .app()
          .database(
            "https://lms-chats-default-rtdb.asia-southeast1.firebasedatabase.app/"
          )
          .ref(`/chats/${messageKey.current}/messages/`);
      }

      messageRef.current
        .orderByChild("timestamp")
        .limitToLast(1)
        .on("value", (snapshot) => {
          snapshot.forEach((s) => {
            setMessages((messages) => {
              return {
                ...messages,
                [s.key]: s.val(),
              };
            });
          });
        });
      messageRef.current
        .orderByChild("timestamp")
        .limitToLast(5)
        .once("value")
        .then((snapshot) => {
          let temp = null;
          snapshot.forEach((s) => {
            temp = { ...temp, [s.key]: s.val() };
          });

          setMessages(temp);
        });
    } catch (error) {
      console.error(error);
    } finally {
      globalStoreDispatcher(action.turnOffIndicator());
    }
    return () => {
      messageRef.current.off("child_added");
    };
  }, []);
  const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.y === 0;
  };
  const loadMoreMessages = ({ nativeEvent }) => {
    if (isCloseToTop(nativeEvent)) {
      globalStoreDispatcher(action.turnOnIndicator());
      try {
        const currentKey = Object.keys(messages)[0];
        messageRef.current
          .orderByChild("timestamp")
          .endAt(messages[currentKey]["timestamp"])
          .limitToLast(5)
          .once("value")
          .then((snapshot) => {
            let temp = {};
            snapshot.forEach((s) => {
              if (s.val()) {
                temp = {
                  ...temp,
                  [s.key]: s.val(),
                };
              }
            });

            setMessages((messages) => {
              return {
                ...temp,
                ...messages,
              };
            });
          });
      } catch (error) {
        console.error(error);
      } finally {
        globalStoreDispatcher(action.turnOffIndicator());
      }
    }
  };

  const sendMessage = () => {
    if (newMessage === "") {
      return;
    }
    messageRef.current.push().set({
      sender_id: user.id,
      message: newMessage,
      timestamp: Date.now(),
    });
    const database = firebase
      .app()
      .database(
        "https://lms-chats-default-rtdb.asia-southeast1.firebasedatabase.app/"
      );
    const opponentRef = database.ref(
      `/user_key/${infor[messageKey.current]["opponentId"]}/${
        messageKey.current
      }/`
    );

    opponentRef
      .child("unread")
      .once("value")
      .then((res) => {
        let newUnread = 1;
        if (res.val()) {
          newUnread += parseInt(res.val());
        }
        opponentRef.update({ unread: newUnread });
      });
    setNewMessage("");
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={heaederHeight}
      style={{ flex: 1, height: height }}
    >
      <View style={globalStyle.chatHeader}>
        <Avatar.Image
          size={50}
          source={{ uri: infor[messageKey.current]["senderAvatar"] }}
        />
        <Text theme={{ colors: { onSurface: "#fff" } }} variant="titleMedium">
          {infor[messageKey.current]["senderName"]}
        </Text>
      </View>
      <KeyboardAwareScrollView
        onScroll={loadMoreMessages}
        contentContainerStyle={[globalStyle.list, { height: height }]}
      >
        {Object.keys(messages).map((m, index) => {
          return (
            <List.Item
              style={globalStyle.listItemSpace}
              left={() =>
                user["id"] !== messages[m]["sender_id"] ? (
                  <Avatar.Image
                    style={componentsStyles.messageAvatarLeft}
                    size={30}
                    source={{ uri: infor[messageKey.current]["senderAvatar"] }}
                  />
                ) : null
              }
              right={() =>
                user["id"] === messages[m]["sender_id"] ? (
                  <Avatar.Image
                    style={componentsStyles.messageAvatarRight}
                    size={30}
                    source={{ uri: user["avatar"] }}
                  />
                ) : null
              }
              descriptionStyle={
                user.id === messages[m]["sender_id"]
                  ? componentsStyles.messageTimeLeft
                  : componentsStyles.messageTimeRight
              }
              title={() => (
                <View style={componentsStyles.messageContent}>
                  <Text style={componentsStyles.messageContentText}>
                    {messages[m]["message"]}
                  </Text>
                </View>
              )}
              description={moment(messages[m]["timestamp"]).calendar()}
              key={index}
            />
          );
        })}
      </KeyboardAwareScrollView>

      {messageKey.current === "admin" ? null : (
        <View style={[globalStyle.chatInputWrapper]}>
          <TextInput
            style={globalStyle.chatInput}
            placeholder="Write your message"
            mode="outlined"
            value={newMessage}
            onChangeText={setNewMessage}
          ></TextInput>
          <TouchableOpacity onPress={sendMessage}>
            <Icon color="#1E90FF" size={40} source="send" />
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default Chat;
