import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  const [language, setLanguage] = useState("en"); // 번역할 언어 설정
  const [photo, setPhoto] = useState(null); // 촬영된 이미지 URI
  const [translation, setTranslation] = useState(""); // 번역 결과

  // 사진 촬영
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("오류", "카메라 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri); // 촬영된 사진 저장
    }
  };

  // 번역 요청
  const handleTranslation = async () => {
    if (!photo) {
      Alert.alert("오류", "사진을 먼저 촬영해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("image", {
      uri: photo,
      name: "photo.jpg",
      type: "image/jpeg",
    });
    formData.append("language", language);

    try {
      const response = await fetch("http://192.168.0.10:5000/translate", {
        // 백엔드 서버 URL 입력
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        Alert.alert("오류", data.error);
      } else {
        setTranslation(data.translated_text); // 번역 결과 저장
      }
    } catch (error) {
      Alert.alert("오류", "번역 서버에 연결할 수 없습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="언어 코드 (예: en)"
        value={language}
        onChangeText={setLanguage}
      />
      <Button title="사진 촬영" onPress={takePhoto} />
      <Button title="번역 요청" onPress={handleTranslation} />
      {photo && <Image source={{ uri: photo }} style={styles.image} />}
      {translation && <Text style={styles.translation}>{translation}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "80%",
    marginBottom: 20,
    borderRadius: 5,
  },
  image: { width: 300, height: 300, marginTop: 20 },
  translation: { marginTop: 20, fontSize: 16, color: "green" },
});
