/**
 * Created by Kapil on 19/12/2018.
 */

import React from 'react';
import { StyleSheet, Text, View, Image, Platform, ScrollView, Button, TextInput, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { styles } from './Styles';
import App from '../App';
import { config } from '../config';

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

    _handleSignup = () => {
      if (this.state.username !== "" && this.state.name !== "" && this.state.email !== "" && this.state.password !== "" && this.state.confirmPassword !== "" && this.state.password === this.state.confirmPassword)
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
                email: this.state.email
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

                // If you need to do anything with the user, do it here
                // The user will be logged in automatically by the
                // `onAuthStateChanged` listener we set up in App.js earlier
            })
            .catch((error) => {
              console.log(error);
                // const { code, message } = error;
                // switch (code) {
                //     case 'auth/email-already-in-use':
                //         this.setState({errorMsg: "User not found/incorrect password. Please check your email and password then try again."});
                //         break;
                //     case 'auth/invalid-email':
                //         this.setState({errorMsg: "Entered email was invalid, please check it and try again."});
                //         break;
                //     case 'auth/weak-password':
                //         this.setState({errorMsg: "Password is too weak"});
                //         break;
                // }
            });
          } else {
            if (this.state.username === "") {
                this.setState({usernameBorderColour: 'red', usernameBorderWidth: 3});
            } else {
              this.setState({usernameBorderColour: 'gray', usernameBorderWidth: 1});
            }
            if (this.state.name === "") {
                this.setState({nameBorderColour: 'red', nameBorderWidth: 3});
            } else {
                this.setState({nameBorderColour: 'gray', nameBorderWidth: 1});
            }
            if (this.state.email === "") {
                this.setState({emailBorderColour: 'red', emailBorderWidth: 3});
            } else {
                this.setState({emailBorderColour: 'gray', emailBorderWidth: 1});
            }
            if (this.state.password === "") {
                this.setState({passwordBorderColour: 'red', passwordBorderWidth: 3});
            } else {
                this.setState({passwordBorderColour: 'gray', passwordBorderWidth: 1});
            }
            if (this.state.confirmPassword === "") {
                this.setState({confirmPasswordBorderColour: 'red', confirmPasswordBorderWidth: 3});
            } else {
                this.setState({confirmPasswordBorderColour: 'gray', confirmPasswordBorderWidth: 1});
            }
            if (this.state.confirmPassword !== this.state.password) {
                this.setState({passwordBorderColour: 'red', passwordBorderWidth: 3, confirmPasswordBorderColour: 'red', confirmPasswordBorderWidth: 3});
            }
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
