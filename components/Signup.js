/**
 * Created by Kapil on 19/12/2018.
 */

import React from 'react';
import { StyleSheet, Text, View, Image, Platform, ScrollView, Button, TextInput, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { styles } from './Styles';
import App from '../App';
import { config } from '../config';
import { Notifications } from 'expo';

export default class Signup extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor() {
        super();
        this.state = {
          username: "",
          password: "",
          confirmPassword: "",
          name: "",
          email: "",
          errorMsg: "",
          usernameBorderColour: 'gray',
          passwordBorderColour: 'gray',
          usernameBorderWidth: 1,
          passwordBorderWidth: 1,
          nameBorderColour: 'gray',
          confirmPasswordBorderColour: 'gray',
          nameBorderWidth: 1,
          confirmPasswordBorderWidth: 1,
          emailBorderColour: 'gray',
          emailBorderWidth: 1
        };
    }

    _handleSignup = async () => {
        let token = null;
        if (Platform.OS === 'android'){
            token = await Notifications.getExpoPushTokenAsync();
        }

      if (this.state.username !== "" && this.state.name !== "" && this.state.email !== "" && this.state.password !== ""
          && this.state.confirmPassword !== "" && this.state.password === this.state.confirmPassword && /^[a-zA-Z0-9_\-]+$/.test(this.state.username)
          && this.state.password !== this.state.username && /^[a-zA-Z0-9_\-.]+@[a-zA-Z0-9_\-.]+\.[a-z]+$/.test(this.state.email)
          && /[a-z]+/.test(this.state.password) && /[A-Z]+/.test(this.state.password) && /[0-9]/.test(this.state.password)
          && /[!@_]+/.test(this.state.password) && this.state.password.length >= 8)
      {
        fetch('http://'+ config.url + ':' + config.port + '/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                name: this.state.name,
                email: this.state.email,
                token: token
            }),
        })
            .then(user => user.json())
            .then(user => {
                  if (user.message === "User already exists")
                  {
                    alert("User already exists")
                  } else {
                    AsyncStorage.setItem('user', JSON.stringify(user.user))
                      .then(() => {
                        App.socketJoin(user.user.id);
                        this.props.navigation.navigate("Home");
                      });
                  }
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
            if (this.state.password === "" || !/[a-z]+/.test(this.state.password) || !/[A-Z]+/.test(this.state.password)
                || !/[0-9]/.test(this.state.password) || !/[!@_]+/.test(this.state.password) || this.state.password.length < 8) {
                newState.passwordBorderColour = 'red';
                newState.passwordBorderWidth = 3;
                newState.errorMsg += "Password must be 8 characters and contain at least one uppercase letter, lowercase letter, number and special character (!@_)\n";
            } else {
                newState.passwordBorderColour = 'gray';
                newState.passwordBorderWidth = 1;
            }
            if (this.state.confirmPassword === "") {
                newState.confirmPasswordBorderColour = 'red';
                newState.confirmPasswordBorderWidth = 3;
            } else {
                newState.confirmPasswordBorderColour = 'gray';
                newState.confirmPasswordBorderWidth = 1;
            }
            if (this.state.confirmPassword !== this.state.password) {
                newState.passwordBorderColour = 'red';
                newState.passwordBorderWidth = 3;
                newState.confirmPasswordBorderColour = 'red';
                newState.confirmPasswordBorderWidth = 3;
                newState.errorMsg = "Passwords don't match\n"
            }
            this.setState(newState);
          }
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.welcomeContainer}>
                    <Text>{"\n\n"}</Text>
                    <Image
                        source={
                            require('../assets/images/icon.png')
                        }
                        style={styles.welcomeImage}
                    />
                </View>

                <View style={styles.getStartedContainer}>

                    <Text style={styles.getStartedText}>Sign Up{"\n"}</Text>

                    <TextInput placeholder="Username" autoCapitalize="none" textContentType="username"
                               style={{
                        height: 40,
                        width: "75%",
                        borderColor: this.state.usernameBorderColour,
                        borderWidth: this.state.usernameBorderWidth
                    }} onChangeText={(text) => this.setState({username: text})}/>
                    <Text>{"\n"}</Text>
                    <TextInput placeholder="Email" autoCapitalize="none" textContentType="emailAddress"
                               keyboardType="email-address" style={{
                        height: 40,
                        width: "75%",
                        borderColor: this.state.emailBorderColour,
                        borderWidth: this.state.emailBorderWidth
                    }} onChangeText={(text) => this.setState({email: text})}/>
                    <Text>{"\n"}</Text>
                    <TextInput placeholder="Name"
                               style={{
                        height: 40,
                        width: "75%",
                        borderColor: this.state.nameBorderColour,
                        borderWidth: this.state.nameBorderWidth
                    }} onChangeText={(text) => this.setState({name: text})}/>
                    <Text>{"\n"}</Text>
                    <TextInput placeholder="Password" secureTextEntry={true} textContentType="password" style={{
                        height: 40,
                        width: "75%",
                        borderColor: this.state.passwordBorderColour,
                        borderWidth: this.state.passwordBorderWidth
                    }} onChangeText={(text) => this.setState({password: text})}/>
                    <Text>{"\n"}</Text>
                    <TextInput placeholder="Confirm Password" secureTextEntry={true} textContentType="password" style={{
                        height: 40,
                        width: "75%",
                        borderColor: this.state.confirmPasswordBorderColour,
                        borderWidth: this.state.confirmPasswordBorderWidth
                    }} onChangeText={(text) => this.setState({confirmPassword: text})}/>
                    <Text>{"\n"}</Text>
                    <Button title="Sign Up" onPress={() => this._handleSignup()} />
                    <Button title="Return to login" onPress={() => this.props.navigation.navigate("Login")} />
                    <Text>{"\n"}</Text>

                </View>
                <View>
                    <Text style={styles.errorText}>{this.state.errorMsg}</Text>
                </View>
            </View>
        );
    }
};
