import {
  View,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  Button,
  Divider,
  RadioButton,
  Text,
  TextInput,
} from "react-native-paper";
import formStyle from "../styles/formStyle";
import globalStyle from "../styles/globalStyle";
import { useContext, useState } from "react";
import { AuthenticationContext, GlobalStoreContext } from "../configs/context";
import * as action from "../configs/actions";
import { apis, endpoint } from "../configs/apis";
const Register = ({ navigation }) => {
  const globalStoreDispatcher = useContext(GlobalStoreContext);

  const [showPassword, setShowPassword] = useState(true);
  const [registerData, setRegisterData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    gender: false,
  });
  const updateUserState = (data, fieldName) => {
    setRegisterData((registerData) => {
      return {
        ...registerData,
        [fieldName]: data,
      };
    });
  };

  const validate = () => {
    if (registerData["password"] !== registerData["confirmPassword"]) {
      return "Confirm password is not correct";
    }
    for (let key in registerData) {
      if (registerData[key] === "") {
        return `Missing ${key} field`;
      }
    }
    return null;
  };

  const handleRegister = async () => {
    const validatedMessage = validate();

    if (validatedMessage) {
      globalStoreDispatcher(
        action.setWarningAlert({
          title: "Register",
          content: validatedMessage,
        })
      );
      return;
    } else {
      try {
        globalStoreDispatcher(action.turnOnIndicator());
        delete registerData["confirmPassword"];
        const response = await apis(null)
          .post(endpoint["userViewset"], registerData)
          .catch((error) => {
            if (error["response"]["status"] === 400) {
              const errorMessage = error["response"]["data"];
              const key = Object.keys(errorMessage)[0];
              globalStoreDispatcher(
                action.setErrorAlert({
                  title: "Register failed",
                  content: errorMessage[key][0],
                })
              );
            } else {
              globalStoreDispatcher(
                action.setErrorAlert({
                  title: "Register failed",
                  content: "Something went wrong",
                })
              );
            }
          });
        if (response && response["status"] === 201) {
          globalStoreDispatcher(
            action.setSuccessAlert({
              title: "Register",
              content: "Register successfully",
            })
          );
          navigation.navigate("login");
        }
      } catch (ex) {
        console.error(ex);
        globalStoreDispatcher(
          action.setErrorAlert({
            title: "Register failed",
            content: "Something went wrong",
          })
        );
      } finally {
        globalStoreDispatcher(action.turnOffIndicator());
      }
    }
  };
  return (
    <ScrollView>
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
        <View style={style["twoCol"]}>
          <TextInput
            theme={{ roundness: 15 }}
            mode="outlined"
            label="Firstname"
            style={formStyle.formControl}
            value={registerData["first_name"]}
            onChangeText={(data) => updateUserState(data, "first_name")}
          />
          <TextInput
            theme={{ roundness: 15 }}
            mode="outlined"
            label="Lastname"
            style={formStyle.formControl}
            value={registerData["last_name"]}
            onChangeText={(data) => updateUserState(data, "last_name")}
          />
        </View>
        <TextInput
          theme={{ roundness: 15 }}
          mode="outlined"
          label="Username"
          style={formStyle.formControl}
          value={registerData["username"]}
          onChangeText={(data) => updateUserState(data, "username")}
        />
        <TextInput
          theme={{ roundness: 15 }}
          mode="outlined"
          label="Email"
          style={formStyle.formControl}
          value={registerData["email"]}
          onChangeText={(data) => updateUserState(data, "email")}
        />
        <TextInput
          theme={{ roundness: 15 }}
          style={formStyle.formControl}
          secureTextEntry={showPassword}
          mode="outlined"
          label="Password"
          value={registerData["password"]}
          onChangeText={(data) => updateUserState(data, "password")}
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
          value={registerData["confirmPassword"]}
          onChangeText={(data) => updateUserState(data, "confirmPassword")}
          right={
            <TextInput.Icon
              icon="eye"
              onPress={() => setShowPassword((showPassword) => !showPassword)}
            />
          }
        />
        <View style={[style["twoCol"], globalStyle["margin"]]}>
          <Text variant="bodyLarge">Gender</Text>
          <View style={globalStyle["row"]}>
            <Text>Male</Text>
            <RadioButton
              value="Male"
              status={!registerData["gender"] ? "checked" : "unchecked"}
              onPress={() => updateUserState(false, "gender")}
            />
          </View>
          <View style={globalStyle["row"]}>
            <Text>Female</Text>
            <RadioButton
              value="Female"
              status={registerData["gender"] ? "checked" : "unchecked"}
              onPress={() => updateUserState(true, "gender")}
            />
          </View>
        </View>
        <View style={[formStyle.formControl, formStyle.formButton]}>
          <Button onPress={handleRegister} mode="contained">
            Go
          </Button>
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
    </ScrollView>
  );
};

const style = StyleSheet.create({
  twoCol: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});

export default Register;
