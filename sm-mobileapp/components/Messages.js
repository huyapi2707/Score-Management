import {
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { List, Avatar, FAB, Badge, Text } from "react-native-paper";
import globalStyle from "../styles/globalStyle";
import { apis, endpoint } from "../configs/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AuthenticationContext,
  GlobalStoreContext,
  firebaseDatabase,
} from "../configs/context";
import * as action from "../configs/actions";
import NewMessage from "./NewMessage";
import { useRef, useContext, useState, useReducer, useEffect } from "react";
const Messages = ({ navigation, messageKeys }) => {
  const database = useRef(firebaseDatabase);
  const globalStoreDispatcher = useContext(GlobalStoreContext);
  const { user } = useContext(AuthenticationContext);

  const messageReducer = (currentState, action) => {
    switch (action.type) {
      case "LATEST_MESSAGE":
        const key = [action["payload"]["key"]];
        return {
          ...currentState,
          [key]: {
            ...currentState[key],
            latestMessage: action["payload"]["latestMessage"],
          },
        };
      case "NEW_MESSAGE": {
        return {
          ...currentState,
          ...action["payload"],
        };
      }
      case "UNREAD": {
        const key = action["payload"]["key"];
        return {
          ...currentState,
          [key]: {
            ...currentState[key],
            unread: action["payload"]["unread"],
          },
        };
      }
    }
  };
  const [messages, messageDispatcher] = useReducer(messageReducer, {
    admin: {
      senderName: "Admin",
      senderAvatar:
        "https://res.cloudinary.com/ddgtjayoj/image/upload/v1715150854/mzck3pqaqpv57q8szimd.png",
      latestMessage: "",
      unread: true,
    },
  });

  useEffect(() => {
    const announcementsRef = database.current.ref("announcements");
    announcementsRef.limitToLast(1).on("child_added", (snapshot) => {
      messageDispatcher({
        type: "LATEST_MESSAGE",
        payload: {
          key: "admin",
          latestMessage: snapshot.val()["message"],
        },
      });
    });
    return () => {
      announcementsRef.off("child_added");
    };
  }, []);

  const fetchUserInfor = async (userId, key) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const response = await apis(accessToken).get(
      endpoint.userPublicInfor(userId)
    );
    if (response) {
      return { data: response.data, currentKey: key };
    }
    return null;
  };

  const allMessageRefs = useRef({});

  useEffect(() => {
    globalStoreDispatcher(action.turnOnIndicator());
    try {
      for (key in messageKeys) {
        if (allMessageRefs[key] !== undefined) {
          if (messageKeys[key]["unread"] > 0) {
            messageDispatcher({
              type: "unread",
              payload: {
                key: key,
                unread: true,
              },
            });
          }
          continue;
        }

        fetchUserInfor(messageKeys[key]["opponent_id"], key).then(
          ({ data, currentKey }) => {
            if (data) {
              messageDispatcher({
                type: "NEW_MESSAGE",
                payload: {
                  [currentKey]: {
                    opponentId: data["id"],
                    senderName: data["username"],
                    senderAvatar: data["avatar"],
                    unread: messageKeys[key]["unread"] > 0,
                  },
                },
              });
              const messageRef = database.current.ref(
                `/chats/${key}/messages/`
              );
              allMessageRefs.current = {
                ...allMessageRefs,
                [key]: messageRef,
              };
              messageRef.limitToLast(1).on("child_added", (snapshot) => {
                messageDispatcher({
                  type: "LATEST_MESSAGE",
                  payload: {
                    key: key,
                    latestMessage: snapshot.val()["message"],
                  },
                });
              });
            }
          }
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      globalStoreDispatcher(action.turnOffIndicator());
    }
  }, [messageKeys]);

  const { height } = useWindowDimensions();
  const [openNewMessage, setOpenNewMessage] = useState(false);
  return (
    <View style={[globalStyle.list, { height: height }]}>
      <NewMessage visible={openNewMessage} setVisible={setOpenNewMessage} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.keys(messages).map((key) => {
          return (
            <TouchableOpacity
              key={key}
              onPress={() => {
                try {
                  if (key !== "admin") {
                    database.current
                      .ref(`/user_key/${user.id}/${key}/`)
                      .update({ unread: 0 });
                  }
                } catch (error) {
                  console.error(error);
                } finally {
                  navigation.navigate("chat", {
                    infor: {
                      [key]: messages[key],
                    },
                  });
                }
              }}
            >
              <List.Item
                title={messages[key]["senderName"]}
                description={
                  <Text variant={messages[key]["unread"] ? "titleMedium" : ""}>
                    {messages[key]["latestMessage"]}
                  </Text>
                }
                left={() => (
                  <Avatar.Image
                    size={56}
                    source={{ uri: messages[key]["senderAvatar"] }}
                  />
                )}
                right={() =>
                  messages[key]["unread"] ? <Badge size={10}></Badge> : null
                }
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <FAB
        onPress={() => {
          setOpenNewMessage(true);
        }}
        icon="plus"
        style={globalStyle.fab}
      />
    </View>
  );
};

export default Messages;
