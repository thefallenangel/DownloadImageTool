import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  PermissionsAndroid,
  Dimensions,
  TextInput,
  FlatList,
} from 'react-native';
import firebase from "react-native-firebase";
import RNFetchBlob from 'react-native-fetch-blob';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ActionButton from "react-native-action-button";
import Modal from "react-native-modal";

const { width, height } = Dimensions.get("window");

export default class App extends Component {
  constructor(props) {
    super(props);
    this.Crashlytics = firebase.crashlytics();
    this.state = {
      VisibleAddUrlModal: false,
      VisibleSetDirModal: false,
      UrlValue: "",
      DirValue: "",
      //{Status, Value}
      LinkData: [],
    };
    this.renderAddURLModal = this.renderAddURLModal.bind(this);
    this.renderSetDirectoryModal = this.renderSetDirectoryModal.bind(this);
    this.addURL = this.addURL.bind(this);
    this.executeDownload = this.executeDownload.bind(this);
  }

  //Render add url modal
  renderAddURLModal = () => {
    return (
      <Modal isVisible={this.state.VisibleAddUrlModal}>
        <View style={[AppStyle.modal]}>
          <Text style={[AppStyle.text, {
            width: width - 20,
            fontWeight: "bold",
            textAlign: "center",
            backgroundColor: "#ff9999"
          }]}>
            ADD URL
          </Text>
          <TextInput
            style={[AppStyle.textinput, {
              width: width - 20,
              margin: 10
            }]}
            underlineColorAndroid="transparent"
            autoFocus={true}
            onChangeText={(text) => {
              this.setState({
                UrlValue: text
              })
            }}
            value={this.state.UrlValue}
          />
          <View style={{ width: width - 20, flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                flex: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#c0c0c0"
              }}
              onPress={() => {
                this.setState({
                  VisibleAddUrlModal: false
                })
              }}>
              <Text style={[AppStyle.text, { padding: 15 }]}>
                Close
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ff8080"
              }}
              onPress={() => {
                this.addURL();
              }}>
              <Text style={[AppStyle.text, { padding: 15 }]}>
                OK
              </Text>
            </TouchableOpacity>
          </View>


        </View>
      </Modal>
    );
  }

  //Render set directory modal
  renderSetDirectoryModal = () => {
    return (
      <Modal isVisible={this.state.VisibleSetDirModal}>
        <View style={[AppStyle.modal]}>
          <Text style={[AppStyle.text, {
            width: width - 20,
            fontWeight: "bold",
            textAlign: "center",
            backgroundColor: "#ff9999"
          }]}>
            SET DIRECTORY
          </Text>
          <View style={{ flexDirection: "row", width: width - 20, margin: 10 }}>
            <Text style={[AppStyle.text, { alignSelf: "center", paddingRight: 0 }]}>
              DCIM/
            </Text>
            <TextInput
              style={[AppStyle.textinput, {
                flex: 1,
                paddingLeft: 0
              }]}
              underlineColorAndroid="transparent"
              autoFocus={true}
            />
          </View>
          <View style={{ width: width - 20, flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                flex: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#c0c0c0"
              }}
              onPress={() => {
                this.setState({
                  VisibleSetDirModal: false
                })
              }}>
              <Text style={[AppStyle.text, { padding: 15 }]}>
                Close
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ff8080"
              }}
              onPress={() => {
                this.setState({
                  VisibleSetDirModal: false
                })
              }}>
              <Text style={[AppStyle.text, { padding: 15 }]}>
                OK
              </Text>
            </TouchableOpacity>
          </View>


        </View>
      </Modal>
    );
  }

  //Add URL to list
  addURL = () => {
    var data = this.state.LinkData;
    data.push({ Status: 0, Value: this.state.UrlValue });
    this.setState({
      LinkData: data
    })
  }

  //Execute download
  async executeDownload() {
    try {
      const tmp = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
          "title": "Permission request",
          "message": "Let me use your storage"
        });
      if (tmp == PermissionsAndroid.RESULTS.GRANTED) {
        const dirs = RNFetchBlob.fs.dirs;
        const path = dirs.DCIMDir + "/001.jpg";
        var data = this.state.LinkData;
        // for (var i = 0; i < data.length; i++) {
        RNFetchBlob
          .config({
            fileCache: true,
          })
          .fetch("GET", data[0].Value, {})
          .then((result) => {
            result.base64().then((data) => {
              RNFetchBlob.fs.writeFile(path, data, "base64").then(() => {
                console.log(dirs);
                data[0].Status = 1;

                this.setState({
                  LinkData: data
                })
              })
            });
          })
          .catch((error, code) => {
            this.Crashlytics.log(error);
          })
        //}
      }
    }
    catch (error) {
      console.log(error);
      this.Crashlytics.log(error.toString());
    }
  }

  render() {
    return (
      <View style={AppStyle.container}>
        <View style={{
          flexDirection: "row",
          width: width,
          backgroundColor: "#cc0000",
          height: 50
        }}>
          <Text style={[AppStyle.text, {
            flex: 1,
            alignSelf: "center",
            fontSize: 16,
            fontWeight: "bold",
            color: "white"
          }]}>
            DOWNLOAD IMAGE TOOL
          </Text>
          <TouchableOpacity
            style={{ alignSelf: "center", paddingRight: 10 }}
          >
            <Icon
              name="close-octagon"
              color="white"
              size={30}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          style={{
            flex: 1,
            width: width,
            backgroundColor: "#ffe6e6"
          }}
          data={this.state.LinkData}
          renderItem={({ item, index }) => {
            return (
              <View style={{ flex: 1 }}>
                <View style={{
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  borderBottomColor: "#c0c0c0",
                  backgroundColor: item.Status == 0 ? "transparent" : "cyan"
                }}>
                  <Text style={AppStyle.text}>{item.Value}</Text>
                </View>
              </View>
            )
          }}
          keyExtractor={(item, index) => index.toString()}
        />

        <ActionButton buttonColor="#660000">
          <ActionButton.Item buttonColor='#cc0000' title="Execute download" onPress={() => {
            this.executeDownload();
          }}>
            <Icon name="download" color="white" size={24} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#ff0000' title="Set directory" onPress={() => {
            this.setState({
              VisibleSetDirModal: true
            })
          }}>
            <Icon name="folder-download" color="white" size={24} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#ff0000' title="Add URL" onPress={() => {
            this.setState({
              VisibleAddUrlModal: true
            })
          }}>
            <Icon name="link" color="white" size={24} />
          </ActionButton.Item>
        </ActionButton>
        {this.renderAddURLModal()}
        {this.renderSetDirectoryModal()}
      </View>
    );
  }
}

const AppStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  modal: {
    width: width - 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white"
  },
  text: {
    color: "#330000",
    fontSize: 14,
    padding: 8
  },
  textinput: {
    fontSize: 14,
    padding: 8,
    color: "#330000",
    borderBottomWidth: 1,
    borderBottomColor: "#ff0000"
  }
});
