/**
 * Created by Kapil on 19/12/2018.
 */

import React from 'react';
import { StyleSheet, Text, View, Image, Platform, ScrollView, Button, TextInput, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { styles } from './Styles'
const url = "81.133.242.237";
// const url = "192.168.1.113";
const port = "3000";

export default class Login extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor() {
        super();
        this.state = {username: "", password: "", errorMsg: "", usernameBorderColour: 'gray', passwordBorderColour: 'gray', usernameBorderWidth: 1, passwordBorderWidth: 1};
    }

    componentDidMount() {
    }

    _handleLogin = () => {
        this.setState({errorMsg: "", usernameBorderColour: 'gray', usernameBorderWidth: 1, passwordBorderColour: 'gray', passwordBorderWidth: 1});
        if (this.state.username != "" && this.state.password != "")
        {
            console.log('http://'+ url + ':' + port + '/login');
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
                .then(response => response.json())
                // .then(res => console.log(res))
                .then((res) => res)
                .then((res) => {
                    console.log("user");
                    console.log(res);
                    this._loginResp(res);
                    // if (res.message === "Incorrect" || res.message === "User doesn't exist")
                    // {
                    //     this.setState({errorMsg: "User not found/incorrect password. Please check your username and password then try again."});
                    // }
                    // else {
                    //     console.log("Logged in");
                    //     try {
                    //         AsyncStorage.setItem('user', JSON.stringify(res.user));
                    //         this.setState({user: res.user});
                    //         this.props.navigation.navigate("Home");
                    //     } catch (error) {
                    //         console.log("Async catch");
                    //         console.log(error);
                    //     }
                    // }
                    // return;
                });
                // .then(user => {this.setState({resp: user})});
        } else {
            if (this.state.username === "") {
                this.setState({usernameBorderColour: 'red', usernameBorderWidth: 3});
            }
            if (this.state.password === "") {
                this.setState({passwordBorderColour: 'red', passwordBorderWidth: 3});
            }
        }
    };

    _loginResp(res){
        console.log("ahfoahfw");
        console.log(res);
        //alert(JSON.stringify(res));
         if (res.message === "Incorrect" || res.message === "User doesn't exist")
         {
             console.log("Error:");
             console.log(res.message);
             this.setState({errorMsg: "User not found/incorrect password. Please check your username and password then try again."});
         }
         else {
             console.log("Logged in");
             try {
                 AsyncStorage.setItem('user', JSON.stringify(res.user));
                 this.setState({user: res.user});
                 this.props.navigation.navigate("Home");
             } catch (error) {
                 console.log("Async catch");
                 console.log(error);
             }
         }
    }

    render() {
//        console.log(this.state);
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
                    {/*<Button onPress={() => { Alert.alert('You tapped the button!'); }} title="Press Me" />*/}
                    <Button title="Log In" onPress={this._handleLogin}/>
                    <Button title="Click to create account" onPress={() => this.props.navigation.navigate('Signup')} />

                </View>
                <View>
                    <Text style={styles.errorText}>{this.state.errorMsg}</Text>
                </View>
            </View>
        );
    }
};
