import { StyleSheet } from "react-native";
import theme from "../configs/theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  padding: {
    paddingHorizontal: 20,
  },
  list: {
    margin: 20,
  },
  fab: {
    position: "absolute",
    right: 0,
    bottom: 150,
  },
  chatScreen: {
    flex: 1,
    backgroundColor: "red",
  },
  chatHeader: {
    backgroundColor: theme.colors.primary,
    height: 60,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 60,
    columnGap: 10,
  },
  chatInputWrapper: {
    display: "flex",
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
  },
  chatInput: {
    width: "86%",
  },
  listItemSpace: {
    marginBottom: 10,
  },
  margin: {
    margin: 10,
  },
  textCamel: {
    textTransform: "capitalize",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
