// import React, { useState } from "react";
// import { View, Alert } from "react-native";
// import { Text, TextInput, Button } from "react-native-paper";
// import globalStyle from "../styles/globalStyle";
// import { apis, endpoint } from "../configs/apis";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const CreateForum = ({ route }) => {
//   const courseId = route.params?.courseId;
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const createForum = async () => {
//     try {
//       setLoading(true);
//       const accessToken = await AsyncStorage.getItem("accessToken");
//       if (!accessToken) {
//         throw new Error("Access token is missing");
//       }

//       const response = await apis(accessToken).post(endpoint.forum(courseId), {
//         title,
//         content,
//       });

//       if (response.status === 201) {
//         Alert.alert("Success", "Forum has been created successfully");
//         // Handle navigation or other actions here
//       } else {
//         setError("Failed to create forum");
//       }
//     } catch (error) {
//       console.error("Error creating forum:", error);
//       setError("Error creating forum: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={globalStyle.container}>
//       <Text variant="titleLarge">Create Forum</Text>
//       {error && <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>}
//       <TextInput
//         mode="outlined"
//         label="Title"
//         value={title}
//         onChangeText={setTitle}
//       />
//       <TextInput
//         mode="outlined"
//         label="Content"
//         multiline
//         value={content}
//         onChangeText={setContent}
//       />
//       <Button
//         mode="contained"
//         onPress={createForum}
//         disabled={loading || !title || !content}
//       >
//         Create
//       </Button>
//     </View>
//   );
// };

// export default CreateForum;
