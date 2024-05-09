import { View, KeyboardAvoidingView, Image } from "react-native";
import {
  Button,
  Divider,
  IconButton,
  Text,
  TextInput,
} from "react-native-paper";
import formStyle from "./formStyle";
import globalStyle from "../configs/globalStyle";
import { useState } from "react";

const Register = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {};
  return (
    <View>
      <View style={[globalStyle.flexCenter, formStyle.titile]}>
        <Image
          style={globalStyle.logo}
          source={require("../assets/pictures/logo.png")}
        />
        <Text variant="headlineLarge" style={{ fontWeight: "bold" }}>
          Register
        </Text>
      </View>
      <KeyboardAvoidingView style={[formStyle.formGroup]}>
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
          mode="outlined"
          label="Email"
          style={formStyle.formControl}
          value={email}
          onChangeText={setEmail}
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
        <TextInput
          theme={{ roundness: 15 }}
          style={formStyle.formControl}
          secureTextEntry={showPassword}
          mode="outlined"
          label="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          right={
            <TextInput.Icon
              icon="eye"
              onPress={() => setShowPassword((showPassword) => !showPassword)}
            />
          }
        />
        <View style={[formStyle.formControl, formStyle.formButton]}>
          <Button mode="contained">Go</Button>
        </View>
        <Divider bold={true} />
        <View
          style={[
            {
              marginTop: 40,
            },
            globalStyle.flexCenter,
          ]}
        >
          <Text
            onPress={() => {
              navigation.navigate("login");
            }}
          >
            Already have an account?{" "}
            <Text style={{ color: "#1E90FF" }}>Login</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Register;
