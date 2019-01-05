/**
 * Created by Kapil on 19/12/2018.
 */


import React from 'react';
import { Modal, StyleSheet, Text, View, Image, Platform, ScrollView, Button, TextInput, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { styles } from './Styles';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const windowSize = require('Dimensions').get('window');
const deviceWidth = windowSize.width;
const deviceHeight = windowSize.height;
import { config } from '../config'

export default class AddDevice extends React.Component {

  static navigationOptions = {
      title: 'Add Device',
  };

    constructor(){
      super();
      this.state = {deviceid: null};
    }

    componentDidMount(){
        AsyncStorage.getItem('user').then(user => {
            this.setState({user: JSON.parse(user)});
        });
    }

    _addDevice = () => {
        fetch('http://'+ config.url + ':' + config.port + '/assignDevice', {
            method: 'POST',
            headers: {
                // Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: this.state.deviceid,
                username: this.state.user.username
            })
        }).then(res => res.json())
            .then(res => {
                if (res.message === "exists") {
                    this.props.navigation.navigate('Home');
                } else {
                    this.props.navigation.navigate('RegisterDevice', {deviceid: this.state.deviceid})
                }
            })
    };

    render() {
        return (

            <View style={styles.welcomeContainer}>

                <TextInput placeholder="Device ID" autoCapitalize="none"
                           style={{
                               height: 40,
                               width: "75%",
                               borderColor: this.state.deviceidBorderColour,
                               borderWidth: this.state.deviceidBorderWidth
                           }} onChangeText={(text) => this.setState({deviceid: text})}/>
                <Text>{"\n"}</Text>
                <Button title="Add Device" onPress={() => this._addDevice()} />
            </View>
        );
    }
}
