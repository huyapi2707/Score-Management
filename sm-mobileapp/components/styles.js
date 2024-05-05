import { StyleSheet } from "react-native";

const componentsStyles = StyleSheet.create({
  userProfileImage: {
    height: 200,
    width: "100%",
  },
  userProfileAvatar: {
    position: "absolute",
    top: 150,
    left: 145,
    width: 115,
    height: 115,
    borderRadius: 57.5,
    borderWidth: 5,
    borderColor: "rgba(240,248,255,1)",
  },
  userProfileName: {
    marginTop: 70,
  },
});

export default componentsStyles;
