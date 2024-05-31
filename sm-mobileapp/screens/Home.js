import { View } from "react-native";
import Profile from "../components/Profile";
import Courses from "../components/Courses";
import Messages from "../components/Messages";
import { firebase } from "@react-native-firebase/database";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { BottomNavigation } from "react-native-paper";
import { AuthenticationContext } from "../configs/context";
const Home = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const routesRedecer = (currentState, action) => {
    switch (action.type) {
      case "MESSAGES_BADGE": {
        const newMessagesTab = currentState[2];
        newMessagesTab.badge = action.payload;
        return [currentState[0], currentState[1], newMessagesTab];
      }
    }
  };

  const { user } = useContext(AuthenticationContext);

  const [routes, routesDispatcher] = useReducer(routesRedecer, [
    {
      key: "profile",
      title: "Profile",
      focusedIcon: "account-settings",
      unfocusedIcon: "account-settings-outline",
    },
    {
      key: "courses",
      title: "Courses",
      focusedIcon: "book-open-page-variant",
      unfocusedIcon: "book-open-page-variant-outline",
    },
    {
      key: "messages",
      title: "Messages",
      focusedIcon: "message-text",
      unfocusedIcon: "message-text-outline",
      badge: null,
    },
  ]);

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case "profile":
        return <Profile jumpTo={jumpTo} />;
      case "messages":
        return (
          <Messages
            messageKeys={messageKeys.current}
            navigation={navigation}
            jumpTo={jumpTo}
          />
        );
      case "courses":
        return <Courses navigation={navigation} jumpTo={jumpTo} />;
    }
  };

  let messageKeys = useRef({});
  const messageRef = useRef(
    firebase
      .app()
      .database(
        "https://lms-chats-default-rtdb.asia-southeast1.firebasedatabase.app/"
      )
      .ref(`/user_key/${user["id"]}`)
  );
  useEffect(() => {
    messageRef.current.on("value", (snapshot) => {
      let unread = 0;
      //fetch all message keys
      messageKeys.current = snapshot.val();
      for (key in snapshot.val()) {
        unread += snapshot.val()[key]["unread"];
      }
      if (unread === 0) {
        unread = null;
      }
      routesDispatcher({
        type: "MESSAGES_BADGE",
        payload: unread,
      });
    });

    return () => {
      if (user === null) {
        messageRef.current.off("value");
      }
    };
  }, []);

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default Home;
