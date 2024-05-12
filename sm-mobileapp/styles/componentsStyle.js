import { StyleSheet } from "react-native";
import theme from "../configs/theme";
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

  messageContent: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 15,
  },
  messageContentText: {
    color: "#fff",
    fontSize: 16,
  },
  messageTimeLeft: {
    fontSize: 12,
    position: "absolute",
    left: 15,
    bottom: -15,
  },
  messageTimeRight: {
    fontSize: 12,
    position: "absolute",
    right: 0,
    bottom: -15,
  },
  messageAvatarRight: {
    marginLeft: 15,
    marginTop: 5,
  },
  messageAvatarLeft: {
    marginTop: 5,
  },
});

export default componentsStyles;
