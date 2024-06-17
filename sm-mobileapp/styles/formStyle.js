import { StyleSheet } from "react-native";

export default StyleSheet.create({
  titile: {
    marginVertical: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  formControl: {
    marginVertical: 5,
    minWidth: 150,
  },
  formGroup: {
    paddingHorizontal: 40,
  },
  formButton: {
    marginVertical: 30,
    paddingHorizontal: 80,
  },
  loginRedirectText: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fontTitle: {
      fontSize: 24,
      fontWeight: "bold",
  },
  fontCreator: {
    fontStyle: "italic" 
  },
  right: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    backgroundColor: "rgba(76, 175, 80, 0.9)",
    color: "#fff",
    padding: 10, 
  },
  formCreate:{
    padding: 10, 
    margin: 5, 
  }
});
