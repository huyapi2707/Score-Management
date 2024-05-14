import { View, Image } from "react-native";
import {
  Button,
  Divider,
  IconButton,
  Text,
  TextInput,
} from "react-native-paper";
import formStyle from "../styles/formStyle";
import globalStyle from "../styles/globalStyle";
import { useContext, useState } from "react";
import {
  AuthenticationContext,
  GlobalStoreContext,
  clientId,
  clientSecret,
} from "../configs/context";
import * as actions from "../configs/actions";
import { apis, endpoint } from "../configs/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const globalStoreDispatcher = useContext(GlobalStoreContext);
  const { userDispatcher } = useContext(AuthenticationContext);
  const handleLogin = async () => {
    try {
      globalStoreDispatcher(actions.turnOnIndicator());
      if (username === "") {
        globalStoreDispatcher(
          actions.setWarningAlert({
            title: "Missing field",
            content: "Please enter your username",
          })
        );
        return;
      }
      if (password === "") {
        globalStoreDispatcher(
          actions.setWarningAlert({
            title: "Missing field",
            content: "Please enter your password",
          })
        );
        return;
      }
      const authData = {
        grant_type: "password",
        username: username,
        password: password,
        client_id: clientId,
        client_secret: clientSecret,
      };

      const res = await apis()
        .post(endpoint.auth, authData)
        .catch((error) => {
          if (error.response.status === 400) {
            globalStoreDispatcher(
              actions.setErrorAlert({
                title: "Login failed",
                content: "Wrong username or password",
              })
            );
          }
        });

      if (res !== undefined) {
        await AsyncStorage.setItem("accessToken", res.data["access_token"]);
        const userInforResponse = await apis(res.data["access_token"])
          .get(endpoint.userInfor)
          .catch((error) => {
            globalStoreDispatcher(
              actions.setErrorAlert({
                title: "Login failed",
                content: "Something went wrong!!",
              })
            );
          });
        if (userInforResponse !== undefined) {
          userDispatcher({
            type: "LOGIN",
            payload: userInforResponse.data,
          });
        }
      } else {
        globalStoreDispatcher(
          actions.setErrorAlert({
            title: "Login failed",
            content: "Something went wrong!!",
          })
        );
      }
    } catch (ex) {
      console.error(ex);
    } finally {
      globalStoreDispatcher(actions.turnOffIndicator());
    }
  };
  return (
    <View>
      <View style={[globalStyle.flexCenter, formStyle.titile]}>
        <Image
          style={globalStyle.logo}
          source={require("../assets/pictures/logo.png")}
        />
        <Text variant="headlineLarge" style={{ fontWeight: "bold" }}>
          Login
        </Text>
      </View>
      <View style={formStyle.formGroup}>
        <TextInput
          theme={{ roundness: 15 }}
          mode="outlined"
          label="Username"
          style={formStyle.formControl}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          theme={{ roundness: 15 }}
          style={formStyle.formControl}
          secureTextEntry={showPassword}
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          right={
            <TextInput.Icon
              icon="eye"
              onPress={() => setShowPassword((showPassword) => !showPassword)}
            />
          }
        />

        <View style={[formStyle.formControl, formStyle.formButton]}>
          <Button mode="contained" onPress={handleLogin}>
            Go
          </Button>
        </View>
        <View style={formStyle.loginRedirectText}>
          <Text>
            New student? -{" "}
            <Text
              style={{ color: "#1E90FF" }}
              onPress={() => {
                navigation.navigate("register");
              }}
            >
              Register
            </Text>
          </Text>

          <Text>Forgot password?</Text>
        </View>
        <Divider
          bold={true}
          style={{
            marginVertical: 30,
          }}
        />
        <Text>Or login with</Text>
        <View style={globalStyle.flexCenter}>
          <IconButton
            icon="google"
            mode="outlined"
            style={[
              {
                width: 50,
              },
              formStyle.formControl,
            ]}
          />
        </View>
      </View>
    </View>
  );
};

export default Login;
