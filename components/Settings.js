/**
 * Created by Kapil on 19/12/2018.
 */

import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage } from 'react-native';
import { styles } from './Styles'

export default class Settings extends React.Component {
    render() {
      return (
          <View style={{backgroundColor: '#B8EFFF'}}>
            <Button title="Log Out" onPress={this.handleLogout}/>
          </View>
          );
    }

    handleLogout = () => {
        try {
            console.log("Unsetting AsyncStorage user");
            AsyncStorage.removeItem('user');
            this.props.navigation.navigate("Login");
        } catch (error) {
            console.log(error);
        }
    };
};
