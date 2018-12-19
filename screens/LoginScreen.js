/**
 * Created by Kapil on 11/10/2018.
 */

import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    Button,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import MainTabNavigator from '../navigation/MainTabNavigator';
import { AsyncStorage } from "react-native";

// const url = "81.133.242.237";
const url = "127.0.0.1";
const port = "3000";

export default class LoginScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor() {
        super();
        this.state = {username: "", password: "", errorMsg: "", usernameBorderColour: 'gray', passwordBorderColour: 'gray', usernameBorderWidth: 1, passwordBorderWidth: 1};
    }

    handleLogin = () => {
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
                  return response.json();
              })
              .then(user => {
                    if (user.statusText === "Incorrect")
                    {
                        this.setState({errorMsg: "User not found/incorrect password. Please check your username and password then try again."});
                    } else {
                        console.log("Logged in");
                        try {
                            AsyncStorage.setItem('user', JSON.stringify(user));
                            this.setState({user: user});
                        } catch (error) {
                            console.log(error);
                        }
                    }
                })
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
        if (this.state.user){
            return (
                <MainTabNavigator />
            )
        } else {
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
                        <Button title="Log In" onPress={this.handleLogin}/>
                        <Button title="Sign Up" onPress={this.handleSignup}/>

                    </View>
                    <View>
                        <Text style={styles.errorText}>{this.state.errorMsg}</Text>
                    </View>
                </View>
            );
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#B8EFFF',
    },
    developmentModeText: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
    },
    contentContainer: {
        paddingTop: 30,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)',
    },
    codeHighlightContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
    },
    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 20,
            },
        }),
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        paddingVertical: 20,
    },
    tabBarInfoText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'center',
    },
    navigationFilename: {
        marginTop: 5,
    },
    helpContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        fontSize: 14,
        color: '#2e78b7',
    },
    errorText: {
        fontSize: 20,
        color: '#ff0000',
        fontWeight: 'bold'
    }
});
