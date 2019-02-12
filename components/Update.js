/**
 * Created by Kapil on 19/12/2018.
 */

import React from 'react';
import { StyleSheet, Text, View, Image, Platform, ScrollView, Button, TextInput, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { styles } from './Styles';
import App from '../App';
import { config } from '../config';
import { Notifications } from 'expo';

export default class Update extends React.Component {
    static navigationOptions = {
        title: "Update Account Details",
    };

    constructor() {
        super();
        this.state = {
            id: null,
            username: "",
            name: "",
            email: "",
            errorMsg: "",
            usernameBorderColour: 'gray',
            usernameBorderWidth: 1,
            nameBorderColour: 'gray',
            nameBorderWidth: 1,
            emailBorderColour: 'gray',
            emailBorderWidth: 1
        };
    }

    componentDidMount(){
        AsyncStorage.getItem('user').then(user => {
            user = JSON.parse(user);
            console.log(user);
            this.setState({
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email
            });
        });
    }

    _handleUpdate = async () => {
      if (this.state.username !== "" && this.state.name !== "" && this.state.email !== ""
          && /^[a-zA-Z0-9_\-.]+@[a-zA-Z0-9_\-.]+\.[a-z]+$/.test(this.state.email))
      {
          console.log("FOO");
        fetch('http://'+ config.url + ':' + config.port + '/updateAccount', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.id,
                username: this.state.username,
                name: this.state.name,
                email: this.state.email
            }),
        })
            .then(res => res.json())
            .then(res => {
                  if (res.message === "Success")
                  {
                      AsyncStorage.getItem('user').then(user => {
                          user = JSON.parse(user);
                          user.username = this.state.username;
                          user.name = this.state.name;
                          user.email = this.state.email;
                          AsyncStorage.setItem('user', JSON.stringify(user))
                              .then(() => {
                                  this.props.navigation.navigate("Home");
                              });
                      });
                  } else {
                      this.state.errorMsg = "Something went wrong";
                  }

                // If you need to do anything with the user, do it here
                // The user will be logged in automatically by the
                // `onAuthStateChanged` listener we set up in App.js earlier
            })
            .catch((error) => {
              console.log(error);
            });
          } else {
            let newState = {
                errorMsg: ""
            };
            if (this.state.username === "") {
                newState.usernameBorderColour = 'red';
                newState.usernameBorderWidth = 3;
                newState.errorMsg += "Username can't be empty\n";

            } else {
                newState.usernameBorderColour = 'gray';
                newState.usernameBorderWidth = 1;
            }
            if (this.state.name === "") {
                newState.nameBorderColour = 'red';
                newState.nameBorderWidth = 3;
                newState.errorMsg += "Name can't be empty\n";
            } else {
                newState.nameBorderColour = 'gray';
                newState.nameBorderWidth = 1;
            }
            if (this.state.email === "" || !/^[a-zA-Z0-9_\-.]+@[a-zA-Z0-9_\-.]+\.[a-z]+$/.test(this.state.email)) {
                newState.emailBorderColour = 'red';
                newState.emailBorderWidth = 3;
                newState.errorMsg += "Invalid email address\n";
            } else {
                newState.emailBorderColour = 'gray';
                newState.emailBorderWidth = 1;
            }
            this.setState(newState);
          }
    };

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.getStartedContainer}>

                    <TextInput value={this.state.username} autoCapitalize="none" textContentType="username"
                               style={{
                        height: 40,
                        width: "75%",
                        borderColor: this.state.usernameBorderColour,
                        borderWidth: this.state.usernameBorderWidth
                    }} onChangeText={(text) => this.setState({username: text})}/>
                    <Text>{"\n"}</Text>
                    <TextInput value={this.state.name}
                                                  style={{
                                                      height: 40,
                                                      width: "75%",
                                                      borderColor: this.state.nameBorderColour,
                                                      borderWidth: this.state.nameBorderWidth
                                                  }} onChangeText={(text) => this.setState({name: text})}/>
                    <Text>{"\n"}</Text>
                    <TextInput value={this.state.email} autoCapitalize="none" textContentType="emailAddress"
                               keyboardType="email-address" style={{
                        height: 40,
                        width: "75%",
                        borderColor: this.state.emailBorderColour,
                        borderWidth: this.state.emailBorderWidth
                    }} onChangeText={(text) => this.setState({email: text})}/>
                    <Text>{"\n"}</Text>

                    <Button title="Update Account" onPress={() => this._handleUpdate()} />
                    <Text>{"\n"}</Text>

                </View>
                <View>
                    <Text style={styles.errorText}>{this.state.errorMsg}</Text>
                </View>
            </View>
        );
    }
};
