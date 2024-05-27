import React, { useEffect, useReducer } from 'react';
import { View, Text, KeyboardAvoidingView } from 'react-native';
import { PaperProvider, Dialog, Portal, Button, ActivityIndicator } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyle from './styles/globalStyle';
import theme from './configs/theme';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import Chat from './components/Chat';
import CourseDetail from './components/CourseDetail';

import {
  AuthenticationContext,
  GlobalStoreContext,
  authenticationReducer,
  globalStoreReducer,
} from './configs/context';
import * as actions from './configs/actions';
import { apis, endpoint } from './configs/apis';

export default function App() {
  const [globalStore, globalStoreDispatcher] = useReducer(globalStoreReducer, {
    alert: {},
    indicator: { visible: false },
  });

  const [user, userDispatcher] = useReducer(authenticationReducer, null);

  const callLogin = async () => {
    if (user === null) {
      const access_token = await AsyncStorage.getItem('accessToken');
      if (access_token === null) return;
      try {
        const response = await apis(access_token).get(endpoint.userInfor);
        userDispatcher({ type: 'LOGIN', payload: response.data });
      } catch (error) {
        AsyncStorage.clear();
      }
    }
  };

  useEffect(() => {
    globalStoreDispatcher(actions.turnOnIndicator());
    callLogin().finally(() => {
      globalStoreDispatcher(actions.turnOffIndicator());
    });
  }, []);

  const MainStack = createNativeStackNavigator();
  return (
    <PaperProvider theme={theme}>
      <AuthenticationContext.Provider value={{ user, userDispatcher }}>
        <GlobalStoreContext.Provider value={globalStoreDispatcher}>
          <KeyboardAvoidingView style={globalStyle.container}>
            <Portal>
              <Dialog visible={globalStore.alert.visible}>
                <Dialog.Icon color={globalStore.alert.color} icon={globalStore.alert.icon} />
                <Dialog.Title>{globalStore.alert.title}</Dialog.Title>
                <Dialog.Content>
                  <Text variant="bodyMedium">{globalStore.alert.content}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => globalStoreDispatcher(actions.turnOffAlert())}>OK</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
            {globalStore.indicator.visible && (
              <View style={globalStyle.activityIndicator}>
                <ActivityIndicator size="large" />
              </View>
            )}
            <NavigationContainer>
              <MainStack.Navigator screenOptions={{ title: null, headerTransparent: true }}>
                {user ? (
                  <>
                    <MainStack.Screen name="home" component={Home} />
                    <MainStack.Screen name="chat" component={Chat} />
                    <MainStack.Screen name="coursedetail" component={CourseDetail} />
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
