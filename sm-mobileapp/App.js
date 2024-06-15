import React, { useEffect, useReducer } from "react";

import { View, Text, KeyboardAvoidingView } from "react-native";
import globalStyle from "./styles/globalStyle";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Home from "./screens/Home";
import Chat from "./components/Chat";
import CourseDetail from "./components/CourseDetail";
import Forum from './components/Forum';
import {
  PaperProvider,
  Dialog,
  Portal,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import theme from "./configs/theme";
import {
  AuthenticationContext,
  GlobalStoreContext,
  authenticationReducer,
  globalStoreReducer,
} from "./configs/context";
import * as actions from "./configs/actions";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apis, endpoint } from "./configs/apis";
import StudentCourse from "./components/StudentCourse.js";
import LecturerCourse from "./components/LecturerCourse.js";
import CreateForum from "./components/CreateForum.js"; 
import ForumDetail from "./components/ForumDetail.js"; 

export default function App() {
  const [globalStore, globalStoreDispatcher] = useReducer(globalStoreReducer, {
    alert: {},
    indicator: {
      visible: false,
    },
  });

  const [user, userDispatcher] = useReducer(authenticationReducer, null);

  const callLogin = async () => {
    if (user === null) {
      const access_token = await AsyncStorage.getItem("accessToken");
      if (access_token === null) {
        return;
      }
      const response = await apis(access_token)
        .get(endpoint.userInfor)
        .catch((error) => {
          AsyncStorage.clear();
        });
      if (response !== undefined) {
        userDispatcher({
          type: "LOGIN",
          payload: response.data,
        });
      }
    }
  };

  useEffect(() => {
    try {
      globalStoreDispatcher(actions.turnOnIndicator());
      callLogin();
    } catch (ex) {
      console.error(ex);
    } finally {
      globalStoreDispatcher(actions.turnOffIndicator());
    }
  }, []);

  const MainStack = createNativeStackNavigator();
  return (
    <PaperProvider theme={theme}>
      <AuthenticationContext.Provider
        value={{ user: user, userDispatcher: userDispatcher }}
      >
        <GlobalStoreContext.Provider value={globalStoreDispatcher}>
          <KeyboardAvoidingView style={globalStyle.container}>
            <Portal>
              <Dialog visible={globalStore.alert.visible}>
                <Dialog.Icon
                  color={globalStore.alert.color}
                  icon={globalStore.alert.icon}
                />
                <Dialog.Title>{globalStore.alert.title}</Dialog.Title>
                <Dialog.Content>
                  <Text variant="bodyMedium">{globalStore.alert.content}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    onPress={() =>
                      globalStoreDispatcher(actions.turnOffAlert())
                    }
                  >
                    OK
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
            {globalStore.indicator.visible && (
              <View style={globalStyle.activityIndicator}>
                <ActivityIndicator size="large" />
              </View>
            )}
            <NavigationContainer>
              <MainStack.Navigator
                screenOptions={{
                  title: null,
                  headerTransparent: true,
                }}
              >
                {user ? (
                  <>
                    <MainStack.Screen name="home" component={Home} />
                    <MainStack.Screen name="chat" component={Chat} />
                    <MainStack.Screen
                      name="userCourse"
                      component={
                        user["role"] === "student"
                          ? StudentCourse
                          : LecturerCourse
                      }
                    />
                    <MainStack.Screen name="forum" component={Forum} />
                    <MainStack.Screen name="createforum" component={CreateForum} />
                    <MainStack.Screen name="forumdetail" component={ForumDetail} />
                  </>
                ) : (
                  <>
                    <MainStack.Screen name="login" component={Login} />
                    <MainStack.Screen name="register" component={Register} />
                  </>
                )}
              </MainStack.Navigator>
            </NavigationContainer>
          </KeyboardAvoidingView>
        </GlobalStoreContext.Provider>
      </AuthenticationContext.Provider>
    </PaperProvider>
  );
}
