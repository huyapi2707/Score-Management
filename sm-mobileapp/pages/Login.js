import { View } from "react-native";
import {
  Button,
  Divider,
  IconButton,
  Text,
  TextInput,
} from "react-native-paper";
import formStyle from "./formStyle";
import globalStyle from "../configs/globalStyle";
import { useContext, useState } from "react";
import { GlobalStoreContext } from "../configs/context";
import * as actions from "../configs/actions";
const Login = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const globalStoreDispatcher = useContext(GlobalStoreContext);
  const handleLogin = () => {
    globalStoreDispatcher(actions.turnOnIndicator());
  };
  return (
    <View>
      <View style={[globalStyle.flexCenter, formStyle.titile]}>
        <Text variant="displaySmall" style={{ fontWeight: "bold" }}>
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
