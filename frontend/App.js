import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
console.log("Camera Object:", Camera);
console.log("Camera.Constants:", CameraType.Constants);

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [photo, setPhoto] = useState(null);
  const [type, setType] = useState(CameraType.Constants);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log("Camera permission status:", status);
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>카메라 권한 요청 중...</Text>;
  }
  if (hasPermission === false) {
    return (
      <Text>카메라 권한이 없습니다. 설정에서 카메라 권한을 허용하세요.</Text>
    );
  }

  const takePhoto = async () => {
    if (cameraRef) {
      const photoData = await cameraRef.takePictureAsync();
      setPhoto(photoData.uri);
      setIsCameraOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      {isCameraOpen ? (
        <Camera
          style={styles.camera}
          type={Camera}
          ref={(ref) => setCameraRef(ref)}
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.controlButton} onPress={takePhoto}>
              <Text style={styles.controlText}>촬영</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setIsCameraOpen(false)}
            >
              <Text style={styles.controlText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <View style={styles.mainContainer}>
          <TextInput
            style={styles.input}
            placeholder="언어 코드 (예: en)"
            value={language}
            onChangeText={setLanguage}
          />
          <Button title="카메라 열기" onPress={() => setIsCameraOpen(true)} />
          {photo && <Image source={{ uri: photo }} style={styles.image} />}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1, width: "100%" },
  cameraControls: { flex: 1, justifyContent: "flex-end", marginBottom: 20 },
  controlButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  controlText: { color: "#000", fontSize: 16 },
  mainContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "100%",
    marginBottom: 20,
  },
  image: { width: 300, height: 300, marginTop: 20 },
});
