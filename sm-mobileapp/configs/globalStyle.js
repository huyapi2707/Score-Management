import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  flexCenter: {
    display: "flex",
    alignItems: "center",
  },
  activityIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    end: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    height: "100%",
    zIndex: 2,
  },
  logo: {
    width: 80,
    height: 80,
  },
});
