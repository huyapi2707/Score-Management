import { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Dialog,
  Portal,
  Button,
  Searchbar,
  List,
  Avatar,
  Icon,
} from "react-native-paper";
import { apis, endpoint } from "../configs/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import globalStyle from "../styles/globalStyle";
import componentsStyles from "../styles/componentsStyle";
import { AuthenticationContext, firebaseDatabase } from "../configs/context";

const NewMessage = ({ visible, setVisible }) => {
  const [userKeyword, setUserKeyword] = useState("");
  const [searchedUser, setSearchedUser] = useState([]);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { user } = useContext(AuthenticationContext);
  const renderSearchedUser = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedUserId(item["id"]);
        }}
        key={item["id"]}
      >
        <List.Item
          title={item["username"]}
          description={item["first_name"] + " " + item["last_name"]}
          left={() => (
            <Avatar.Image size={40} source={{ uri: item["avatar"] }} />
          )}
          right={() => {
            if (item["id"] === selectedUserId) {
              return <Avatar.Icon size={20} icon="check-circle" />;
            }
            return null;
          }}
        />
      </TouchableOpacity>
    );
  };
  const nextUrl = useRef("");
  const handleSearch = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const response = await apis(accessToken).get(
      endpoint.userPublicInforList(userKeyword)
    );
    if (response) {
      nextUrl.current = response["data"]["next"];
      setSearchedUser(response["data"]["results"]);
    }
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
    );
  };

  const handleNewMessage = () => {
    const database = firebaseDatabase;
    const newRef = database.ref("/chats/").push();
    newRef.child("messages");
    newKey = newRef.key;
    database.ref(`/user_key/${user["id"]}/${newKey}`).set({
      opponent_id: selectedUserId,
      unread: 0,
    });
    database.ref(`/user_key/${selectedUserId}/${newKey}`).set({
      opponent_id: user["id"],
      unread: 0,
    });
    console.log(newKey);
    setVisible(false);
  };

  const handleSearchScroll = async ({ nativeEvent }) => {
    if (
      isCloseToBottom(nativeEvent) &&
      !isLoadMore &&
      nextUrl.current !== null
    ) {
      try {
        setIsLoadMore(true);
        const accessToken = await AsyncStorage.getItem("accessToken");
        const response = await axios.get(nextUrl.current, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (response) {
          console.log(response["data"]["results"]);
          nextUrl.current = response["data"]["next"];
          setSearchedUser((searchedUser) => [
            ...searchedUser,
            ...response["data"]["results"],
          ]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadMore(false);
      }
    }
  };
  useEffect(() => {
    if (userKeyword === "") {
      setSearchedUser([]);
      return;
    } else {
      handleSearch();
    }
  }, [userKeyword]);
  return (
    <Portal>
      <Dialog visible={visible}>
        <Dialog.Title>New message</Dialog.Title>
        <Dialog.Content>
          <Searchbar
            placeholder="Find by username"
            value={userKeyword}
            onChangeText={setUserKeyword}
          />
          <SafeAreaView style={{ height: 200, width: "100%" }}>
            <FlatList
              style={globalStyle.list}
              onScroll={handleSearchScroll}
              data={searchedUser}
              renderItem={renderSearchedUser}
              keyExtractor={(item) => item["id"]}
            />
          </SafeAreaView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleNewMessage}>OK</Button>
          <Button
            onPress={() => {
              setVisible(false);
            }}
          >
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default NewMessage;
