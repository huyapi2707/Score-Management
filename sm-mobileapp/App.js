import React, { useReducer, useState } from "react";

import { View, Text, KeyboardAvoidingView } from "react-native";
import globalStyle from "./configs/globalStyle";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import {
  PaperProvider,
  Dialog,
  Portal,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import theme from "./configs/theme";
import { GlobalStoreContext, globalStoreReducer } from "./configs/context";
import * as actions from "./configs/actions";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const [globalStore, globalStoreDispatcher] = useReducer(globalStoreReducer, {
    alert: {},
    indicator: {
      visible: false,
    },
  });

  const MainStack = createNativeStackNavigator();
  return (
    <PaperProvider theme={theme}>
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
                  onPress={() => globalStoreDispatcher(actions.turnOffAlert())}
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
              initialRouteName="login"
              screenOptions={{
                title: null,
                headerTransparent: true,
              }}
            >
              <MainStack.Screen name="login" component={Login} />
              <MainStack.Screen name="register" component={Register} />
              <MainStack.Screen name="home" component={Home} />
            </MainStack.Navigator>
          </NavigationContainer>
        </KeyboardAvoidingView>
      </GlobalStoreContext.Provider>
    </PaperProvider>
  );
}
