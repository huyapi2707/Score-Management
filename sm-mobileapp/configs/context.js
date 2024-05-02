import { createContext } from "react";
import theme from "./theme";
const GlobalStoreContext = createContext(null);

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

export { GlobalStoreContext, globalStoreReducer };
