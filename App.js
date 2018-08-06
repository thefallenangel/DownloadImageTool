import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, TouchableOpacity
} from 'react-native';

import firebase from "react-native-firebase";


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Demo: {
        Name: "Ngo Kim Huynh",
        Action: undefined,
      },
    };
  }

  makeError = () => {
    try {
      console.log(this.state.Demo.Action.Hello);
    } catch (error) {
      console.log(firebase.crashlytics()._app.crash());
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.makeError.bind(this)}
        >
          <Text>{this.state.Demo.Name}</Text>
        </TouchableOpacity>
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
