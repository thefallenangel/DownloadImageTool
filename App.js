import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  PermissionsAndroid
} from 'react-native';


import firebase from "react-native-firebase";
import RNFetchBlob from 'react-native-fetch-blob';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.Crashlytics = firebase.crashlytics();
    this.state = {
      URL: "https://img.onvshen.com:85/gallery/21501/23209/s/018.jpg",
      ImageSource: " "
    };
  }

  async makeError() {
    try {
      const tmp = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
        "title": "Permission request",
        "message": "Let me use your storage"
      });
      if (tmp == PermissionsAndroid.RESULTS.GRANTED) {
        const dirs = RNFetchBlob.fs.dirs;
        const path = dirs.DCIMDir + "/001.jpg";
        RNFetchBlob
          .config({
            fileCache: true,
          })
          .fetch("GET", this.state.URL, {})
          .then((result) => {
            result.base64().then((data) => {
              RNFetchBlob.fs.writeFile(path, data, "base64");
              console.log(dirs);
            })

            this.setState({
              ImageSource: "file://" + result.path()
            })
          })
          .catch((error, code) => {
            this.Crashlytics.log(error);
          })
      }
    }
    catch (error) {
      console.log(error);
      this.Crashlytics.log(error.toString());
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{ backgroundColor: "#ff9999" }}
          onPress={this.makeError.bind(this)}
        >

          <Text style={{ padding: 20 }}>
            Fallen Angel
          </Text>
        </TouchableOpacity>
        <Image
          style={{ width: 150, height: 150, marginTop: 10, backgroundColor: "red", display: "none" }}
          source={{
            uri: this.state.ImageSource
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
