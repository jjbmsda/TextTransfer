import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  const [language, setLanguage] = useState("en"); // 번역할 언어 설정
  const [photo, setPhoto] = useState(null); // 촬영된 이미지 URI
  const [translation, setTranslation] = useState(""); // 번역 결과
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 사진 촬영
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 필요", "카메라 접근 권한을 허용해주세요.");
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

    setLoading(true); // 로딩 상태 시작

    const formData = new FormData();
    formData.append("image", {
      uri: photo,
      name: "photo.jpg",
      type: "image/jpeg",
    });
    formData.append("language", language);

    try {
      const response = await fetch("http://192.168.1.49:5000/translate", {
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
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>텍스트 번역기</Text>
      <TextInput
        style={styles.input}
        placeholder="번역할 언어 코드 입력 (예: en)"
        value={language}
        onChangeText={setLanguage}
      />
      <View style={styles.buttonContainer}>
        <Button title="사진 촬영" onPress={takePhoto} color="#007AFF" />
        <Button title="번역 요청" onPress={handleTranslation} color="#28A745" />
      </View>
      {loading && <ActivityIndicator size="large" color="#007AFF" />}
      {photo && <Image source={{ uri: photo }} style={styles.image} />}
      {translation && (
        <Text style={styles.translation}>번역 결과: {translation}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 10,
    width: "90%",
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 8,
  },
  translation: {
    marginTop: 20,
    fontSize: 16,
    color: "#28A745",
    fontWeight: "bold",
    textAlign: "center",
  },
});
