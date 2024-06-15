import { StyleSheet } from "react-native";
import theme from "../configs/theme";
import ExportButton from "../components/ExportButtons";
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
  listCourse: {
    borderRadius: 57.5,
    borderWidth: 5,
    borderColor: "rgba(240,248,255,1)",
  },
  sectionTitle: {
    marginTop: 20,
    backgroundColor: "#ADD8E6",
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  scoreTableTextStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  smallButton: {
    width: 120,
    height: 40,
    borderRadius: 20,
    backgroundColor: "blue",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  listItemForum: {
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    borderColor: "rgba(240,248,255,1)",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  listForumAnswer:{
    borderRadius: 57.5,
    borderWidth: 5,
    borderColor: "rgba(0,0,0,0.2)",
    padding: 10,
  },
  contentTextForum: {
      backgroundColor: "rgba(0,0,0,0.1)",
      padding: 10,
      color: "#000"
  }

  
});

export default componentsStyles;
