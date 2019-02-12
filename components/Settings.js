/**
 * Created by Kapil on 19/12/2018.
 */

import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, Platform } from 'react-native';
import { styles } from './Styles';
import App from '../App';
import { config } from '../config';
import { Notifications } from 'expo';

export default class Settings extends React.Component {

    state = {
      token: ""
    };

    componentDidMount(){
        if (Platform.OS === 'android'){
            Notifications.getExpoPushTokenAsync().then(token =>
                this.setState({token: token})
            );
        }
    }

    render() {
      return (
          <View style={{backgroundColor: '#B8EFFF'}}>
            <Button style={{backgroundColor: '#B8EFFF'}} title="Update Account Details" onPress={() => this.props.navigation.navigate('Update')}/>
            <Button style={{backgroundColor: '#B8EFFF'}} title="Log Out" onPress={this.handleLogout}/>
          </View>
          );
    }

    handleLogout = async () => {
        try {
            AsyncStorage.getItem('user').then(user => {
                fetch('http://' + config.url + ':' + config.port + '/logout', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: this.state.token,
                        user: JSON.parse(user).id
                    }),
                });
                App.socketLeave(JSON.parse(user).id);
                AsyncStorage.clear();
                this.props.navigation.navigate("Login");
            });
        } catch (error) {
            console.log(error);
        }
    };
};
