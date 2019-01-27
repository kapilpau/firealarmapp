/**
 * Created by Kapil on 19/12/2018.
 */


import React from 'react';
import { Modal, StyleSheet, Text, View, Image, Platform, ScrollView, Button, TextInput, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { styles } from './Styles';
const windowSize = require('Dimensions').get('window');
const deviceWidth = windowSize.width;
const deviceHeight = windowSize.height;
import { config } from '../config'
import { BarCodeScanner, Permissions } from 'expo';

let scanned = false;

export default class AddDevice extends React.Component {

  static navigationOptions = {
      title: 'Add Device',
  };

    state = {
        hasCameraPermission: null,
        deviceid: null
    };
    componentDidMount(){
        console.log("Foo");
        AsyncStorage.getItem('user').then(user => {
            this.setState({user: JSON.parse(user)});
        });

        const { status } = Permissions.askAsync(Permissions.CAMERA)
            .then(res => {
                console.log(res);
                this.setState({ hasCameraPermission: res.permissions.camera.status === 'granted' });
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
                if (res.alarm.name || res.message === "alreadyAssigned") {
                    console.log(res);
                    this.props.navigation.navigate('Home', {rerender: true});
                } else {
                    this.props.navigation.navigate('RegisterDevice', {deviceid: this.state.deviceid})
                }
            })
    };

    handleBarCodeScanned = ({ type, data }) => {
        // alert("Scanned");
        // if (!scanned)
        // {
        //     alert("Foo");
        //     scanned = true;
            this.setState({deviceid: data});
            // this._addDevice();
        // } else {
        //     alert("Bar");
        // }
    };

    render() {
        // alert(JSON.stringify(this.state));
        let Scanner = null;
        // if (this.state.hasCameraPermission){
            // alert("Scanner: " + this.state.hasCameraPermission);
            Scanner = (      <View style={{ flex: 1, height: '50%' }}>
                <BarCodeScanner
                    onBarCodeScanned={this.handleBarCodeScanned}
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                />
            </View>);
        // }
        return (

            <View>
                {/*<Text>State {JSON.stringify(this.state)}</Text>*/}
                    <BarCodeScanner
                        onBarCodeScanned={this.handleBarCodeScanned}
                        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                        style={{ height:250, width:'90%', left: '5%', top: '2%' }}
                    />
                <TextInput placeholder="Device ID" autoCapitalize="none"
                           style={{
                               height: 40,
                               width: "75%",
                               borderColor: this.state.deviceidBorderColour,
                               borderWidth: this.state.deviceidBorderWidth
                           }}
                           onChangeText={(text) => this.setState({deviceid: text})}
                           value={this.state.deviceid}
                />
                <Text>{"\n"}</Text>
                <Button title="Add Device" onPress={() => this._addDevice()} />
            </View>
        );
    }
}
