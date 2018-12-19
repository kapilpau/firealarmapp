import React from 'react';
import {View, Button, AsyncStorage, Text, StyleSheet} from 'react-native';
import { ExpoConfigView } from '@expo/samples';
var localStorage = require('react-native-local-storage');
import LoginScreen from '../screens/LoginScreen';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

    componentWillMount(){
        global.done = false;
        try {
            AsyncStorage.getItem('user').then(user => {
                this.setState({user: JSON.parse(user)});
                console.log(this.state.user);
                global.done = true;
            });
        } catch (error) {
            console.log(error);
        }
    }

  handleLogout = () => {
      try {
          console.log("Unsetting AsyncStorage user");
          AsyncStorage.removeItem('user')
              .then(function () {
                  delete this.state.user;
                  this.setState(this.state);
              }.bind(this))
      } catch (error) {
          console.log(error);
      }
  };

  render() {
      try {
        if (this.state.user){
            return (
                <View style={{backgroundColor: '#B8EFFF'}}>
                  <Button title="Log Out" onPress={this.handleLogout}/>
                  <ExpoConfigView />
                </View>
                );
        } else {
            return(
                <View style={styles.container}>
                    <LoginScreen />
                </View>
            );
        }
      } catch(e) {
          return (
              <View style={styles.container}>
                  <Text>Loading</Text>
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
});