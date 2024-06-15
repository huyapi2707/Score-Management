import { View, Image } from "react-native";
import { Button, Divider, Icon, List, Text } from "react-native-paper";
import componentsStyles from "../styles/componentsStyle";
import globalStyle from "../styles/globalStyle";
import { useContext } from "react";
import { AuthenticationContext, GlobalStoreContext } from "../configs/context";
import * as ImagePicker from "expo-image-picker";
import * as actions from "../configs/actions";

import { baseUrl, endpoint } from "../configs/apis";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Profile = () => {
  const { user, userDispatcher } = useContext(AuthenticationContext);
  const globalStoreDispatcher = useContext(GlobalStoreContext);
  const handleLogout = () => {
    userDispatcher({
      type: "LOGOUT",
    });
  };
  const handleChangeAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      globalStoreDispatcher(
        actions.setErrorAlert({
          title: "Update avatar",
          content: "Access denied to your library",
        })
      );
    } else {
      let res = await ImagePicker.launchImageLibraryAsync();
      if (!res.canceled) {
        try {
          globalStoreDispatcher(actions.turnOnIndicator());
          const newAvart = res.assets[0];
          const formData = new FormData();

          formData.append("avatar", {
            uri: newAvart["uri"],
            name: newAvart["fileName"],
            type: newAvart["mimeType"],
          });

          const accessToken = await AsyncStorage.getItem("accessToken");

          const response = await axios.patch(
            baseUrl + endpoint.user(user["id"]),
            formData,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response["status"] === 200) {
            globalStoreDispatcher(
              actions.setSuccessAlert({
                title: "Update avatar",
                content: "Avatar updated",
              })
            );
            userDispatcher({
              type: "SET_AVARTAR",
              payload: newAvart["uri"],
            });
          }
        } catch (ex) {
          globalStoreDispatcher(
            actions.setErrorAlert({
              title: "Update avatar",
              content: "Update failed",
            })
          );
          console.log(ex["message"]);
        } finally {
          globalStoreDispatcher(actions.turnOffIndicator());
        }
      }
    }
  };
  return (
    <View>
      <View>
        <Image
          style={componentsStyles.userProfileImage}
          source={require("../assets/pictures/userProfileImg.jpg")}
        />
        <Image
          style={componentsStyles.userProfileAvatar}
          source={{ uri: user["avatar"] }}
        />
      </View>
      <View style={[globalStyle.flexCenter, componentsStyles.userProfileName]}>
        <Text variant="titleMedium" style={{ marginVertical: 10 }}>
          {user["username"]}
        </Text>
        <Text variant="titleLarge">
          {user["first_name"] + " " + user["last_name"]}
        </Text>
      </View>
      <View style={globalStyle.padding}>
        <Divider style={{ marginVertical: 20 }}></Divider>
        <List.Section>
          <List.Item
            title="Email"
            description={user["email"]}
            left={(props) => <List.Icon {...props} icon="email" />}
          />

          <List.Item
            title="Gender"
            description={!user["gender"] ? "Male" : "Female"}
            left={(props) => (
              <List.Icon
                {...props}
                icon={!user["gender"] ? "gender-male" : "gender-female"}
              />
            )}
          />
        </List.Section>
        <Divider style={{ marginVertical: 20 }} />
        <View
          style={{
            display: "flex",
            alignItems: "flex-start",
            rowGap: 10,
          }}
        >
          <Button
            onPress={handleChangeAvatar}
            icon={() => <Icon color="#1E90FF" size={28} source="camera" />}
          >
            <Text variant="titleSmall" style={{ color: "#1E90FF" }}>
              Change avatar
            </Text>
          </Button>
          <Button
            onPress={handleLogout}
            icon={() => <Icon color="#ee2400" size={28} source="logout" />}
          >
            <Text variant="titleSmall" style={{ color: "#ee2400" }}>
              Log out
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Profile;
