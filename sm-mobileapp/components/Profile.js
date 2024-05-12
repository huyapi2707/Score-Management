import { View, Image } from "react-native";
import { Button, Divider, Icon, List, Text } from "react-native-paper";
import componentsStyles from "../styles/componentsStyle";
import globalStyle from "../styles/globalStyle";
import { useContext } from "react";
import { AuthenticationContext } from "../configs/context";

const Profile = () => {
  const { user } = useContext(AuthenticationContext);
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
            description={user["gender"] ? "Male" : "Female"}
            left={(props) => (
              <List.Icon
                {...props}
                icon={user["gender"] ? "gender-male" : "gender-female"}
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
            icon={() => <Icon color="#1E90FF" size={28} source="camera" />}
          >
            <Text variant="titleSmall" style={{ color: "#1E90FF" }}>
              Change avatar
            </Text>
          </Button>
          <Button
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
