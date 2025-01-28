import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  const [language, setLanguage] = useState("en"); // 번역할 언어 설정
  const [photo, setPhoto] = useState(null); // 촬영된 이미지 URI
  const [translation, setTranslation] = useState(""); // 번역 결과

  // 상태 초기화 함수
  const resetState = () => {
    setLanguage("en"); // 초기 언어 설정
    setPhoto(null); // 이미지 초기화
    setTranslation(""); // 번역 결과 초기화
  };

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
      const response = await fetch("http://192.168.1.49:5000/translate", {
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>번역 앱</Text>
      <TextInput
        style={styles.input}
        placeholder="언어 코드 (예: en)"
        value={language}
        onChangeText={setLanguage}
      />
      <View style={styles.buttonContainer}>
        <Button title="사진 촬영" onPress={takePhoto} color="#007BFF" />
        <Button title="번역 요청" onPress={handleTranslation} color="#28A745" />
      </View>
      {photo && <Image source={{ uri: photo }} style={styles.image} />}
      {translation && (
        <View style={styles.translationContainer}>
          <Text style={styles.translation}>{translation}</Text>
        </View>
      )}
      <Button title="새로고침" color="#DC3545" onPress={resetState} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // 흰색 배경
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    padding: 10,
    width: "80%",
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: "#F9F9F9", // 밝은 배경
    color: "#333333", // 어두운 텍스트 색상
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  translationContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    backgroundColor: "#F9F9F9", // 밝은 배경
    width: "90%",
  },
  translation: {
    fontSize: 16,
    color: "#28A745", // 초록색 텍스트
    textAlign: "center",
  },
});
