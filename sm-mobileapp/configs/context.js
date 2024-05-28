import { createContext } from "react";
import theme from "./theme";
import { firebase } from "@react-native-firebase/database";
const GlobalStoreContext = createContext(null);
const AuthenticationContext = createContext(null);
const authenticationReducer = (currentState, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      return null;
    case "SET_AVARTAR":
      return {
        ...currentState,
        avatar: action["payload"],
      };
  }
};

const globalStoreReducer = (currentState, action) => {
  switch (action.type) {
    case "INDICATOR_OFF":
      return {
        ...currentState,
        indicator: {
          visible: false,
        },
      };
    case "INDICATOR_ON":
      return {
        ...currentState,
        indicator: {
          visible: true,
        },
      };
    case "ALERT_OFF":
      return {
        ...currentState,
        alert: {
          visible: false,
        },
      };
    case "ALERT_ERROR":
      return {
        ...currentState,
        alert: {
          icon: "alert-circle",
          color: theme.colors.error,
          visible: true,
          ...action.payload,
        },
      };
    case "ALERT_WARNING":
      return {
        ...currentState,
        alert: {
          icon: "alert",
          color: theme.colors.warning,
          visible: true,
          ...action.payload,
        },
      };
    case "ALERT_SUCCESS":
      return {
        ...currentState,
        alert: {
          icon: "check-circle",
          color: theme.colors.primary,
          visible: true,
          ...action.payload,
        },
      };
  }
};

const clientId = "EkyweN7hkDmBMjv8jVM16ayiO7oIeM9lIESPQvbU";
const clientSecret =
  "q96hEQqqz3qnUN7OVlT9mdKxppqVNdS9pk197kXuE9tTeUlnfObMSukwGsofnwkFTI3x5WjYQhyO0qR06GgdhxAXPZdNtg9DJzr7XlQyZZnQbxJp7P9ibf18aMGcdLol";

const firebaseDatabase = firebase
  .app()
  .database(
    "https://lms-chats-default-rtdb.asia-southeast1.firebasedatabase.app/"
  );

export {
  GlobalStoreContext,
  globalStoreReducer,
  clientId,
  clientSecret,
  AuthenticationContext,
  authenticationReducer,
  firebaseDatabase,
};
