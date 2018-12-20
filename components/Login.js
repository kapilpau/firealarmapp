/**
 * Created by Kapil on 19/12/2018.
 */

import React from 'react';
import { StyleSheet, Text, View, Image, Platform, ScrollView, Button, TextInput, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { styles } from './Styles'
// const url = "81.133.242.237";
const url = "192.168.1.113";
const port = "3000";

export default class Login extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor() {
        super();
        this.state = {username: "kaps_1997", password: "Pass", errorMsg: "", usernameBorderColour: 'gray', passwordBorderColour: 'gray', usernameBorderWidth: 1, passwordBorderWidth: 1};
    }

    componentDidMount() {
    }

    _handleLogin = () => {
        this.setState({errorMsg: "", usernameBorderColour: 'gray', usernameBorderWidth: 1, passwordBorderColour: 'gray', passwordBorderWidth: 1});
        if (this.state.username != "" && this.state.password != "")
        {
            fetch('http://'+ url + ':' + port + '/login', {
                method: 'POST',
                headers: {
                    // Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                }),
            })
                .then((response) => {
                    // console.log(response.json());
                    console.log(response);
                    response.json();
                }, (err) => {console.log(err)})
                .then(user => {
                    console.log("user");
                    console.log(user);
                    if (user.message === "Incorrect" || user.message === "User doesn't exist")
                    {
                        this.setState({errorMsg: "User not found/incorrect password. Please check your username and password then try again."});
                    } else {
                        console.log("Logged in");
                        try {
                            AsyncStorage.setItem('user', JSON.stringify(user.user));
                            this.setState({user: user.user});
                            this.props.navigation.navigate("Home");
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }, (err) => {console.log(err)})
                .catch((error) => {
                    console.log(JSON.stringify(error));
                    // const { code, message } = error;
                    // switch (code) {
                    //     case 'auth/user-not-found':
                    //     case "auth/wrong-password":
                    //         this.setState({errorMsg: "User not found/incorrect password. Please check your email and password then try again."});
                    //         break;
                    //     case 'auth/invalid-email':
                    //         this.setState({errorMsg: "Entered email was invalid, please check it and try again."});
                    //         break;
                    //     case 'auth/user-disabled':
                    //         this.setState({errorMsg: "Your account has been disabled, please contact support."});
                    //         break;
                    // }
                });
        } else {
            if (this.state.username === "") {
                this.setState({usernameBorderColour: 'red', usernameBorderWidth: 3});
            }
            if (this.state.password === "") {
                this.setState({passwordBorderColour: 'red', passwordBorderWidth: 3});
            }
        }
    };

    handleSignup = () => {
        fetch('http://'+ url + ':' + port + '/signup', {
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
            .then((user) => {
                console.log("Signed up");
                console.log(user);
                // If you need to do anything with the user, do it here
                // The user will be logged in automatically by the
                // `onAuthStateChanged` listener we set up in App.js earlier
            })
            .catch((error) => {
                const { code, message } = error;
                switch (code) {
                    case 'auth/email-already-in-use':
                        this.setState({errorMsg: "User not found/incorrect password. Please check your email and password then try again."});
                        break;
                    case 'auth/invalid-email':
                        this.setState({errorMsg: "Entered email was invalid, please check it and try again."});
                        break;
                    case 'auth/weak-password':
                        this.setState({errorMsg: "Password is too weak"});
                        break;
                }
            });
    };

    render() {
        // console.log(this.state);
        let opts = this;
        return (
            <View style={styles.container}>
                <View style={styles.welcomeContainer}>
                    <Image
                        source={
                            require('../assets/images/icon.png')
                        }
                        style={styles.welcomeImage}
                    />
                </View>

                <View style={styles.getStartedContainer}>

                    <Text style={styles.getStartedText}>Login</Text>

                    <TextInput placeholder="Email" autoCapitalize="none" textContentType="username"
                               keyboardType="email-address" style={{
                        height: 40,
                        width: "75%",
                        borderColor: this.state.usernameBorderColour,
                        borderWidth: this.state.usernameBorderWidth
                    }} onChangeText={(text) => this.setState({username: text})}/>
                    <TextInput placeholder="Password" secureTextEntry={true} textContentType="password" style={{
                        height: 40,
                        width: "75%",
                        borderColor: this.state.passwordBorderColour,
                        borderWidth: this.state.passwordBorderWidth
                    }} onChangeText={(text) => this.setState({password: text})}/>
                    <Button
                        onPress={() => {
                            Alert.alert('You tapped the button!');
                        }}
                        title="Press Me"
                    />
                    <Button title="Log In" onPress={this._handleLogin} />
                    {/*<Button title="Sign Up" onPress={() => opts.handleSignup} />*/}

                </View>
                <View>
                    <Text style={styles.errorText}>{this.state.errorMsg}</Text>
                </View>
            </View>
        );
    }
};
