import { View } from "react-native";
import Profile from "../components/Profile";
import Courses from "../components/Courses";
import Notifies from "../components/Notifies";
import Chats from "../components/Chats";
import { useReducer, useState } from "react";
import { BottomNavigation } from "react-native-paper";
const Home = () => {
  const [index, setIndex] = useState(0);
  const routesRedecer = (currentState, action) => {
    switch (action.type) {
      case "NOTIFIES_BADGE": {
        const newNotifiesTab = currentState[2];
        newNotifiesTab.badge = action.payload;
        return [
          currentState[0],
          currentState[1],
          newNotifiesTab,
          currentState[3],
        ];
      }
      case "CHATS_BADGE": {
        const newChatsTab = currentState[3];
        newChatsTab.badge = action.payload;
        return [currentState[0], currentState[1], currentState[2], newChatsTab];
      }
    }
  };
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
      key: "notifies",
      title: "Notifies",
      focusedIcon: "bell",
      unfocusedIcon: "bell-outline",
      badge: null,
    },
    {
      key: "chats",
      title: "Chats",
      focusedIcon: "chat",
      unfocusedIcon: "chat-outline",
      badge: null,
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    profile: Profile,
    courses: Courses,
    notifies: Notifies,
    chats: Chats,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      onTabPress={(event) => {
        if (event.route.key === "notifies") {
          routesDispatcher({
            type: "NOTIFIES_BADGE",
            payload: null,
          });
        } else if (event.route.key === "chats") {
          routesDispatcher({
            type: "CHATS_BADGE",
            payload: null,
          });
        }
      }}
    />
  );
};

export default Home;
