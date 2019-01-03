import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { AppLoading, Asset, Font, Icon, Permissions, Notifications } from 'expo';
import { AsyncStorage } from "react-native";
import Home from './components/Home';
import Login from './components/Login';
import Settings from './components/Settings';
import Signup from './components/Signup';
import AddDevice from './components/AddDevice';
import SocketIOClient from 'socket.io-client';
import Alert from './components/Alert';
import { config } from './config'
import { createStackNavigator, createSwitchNavigator } from 'react-navigation'

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };



  static async registerForPushNotificationsAsync(id) {
      // Get the token that uniquely identifies this device
      let token = await Notifications.getExpoPushTokenAsync();

      // POST the token to your backend server from where you can retrieve it to send push notifications.
      return fetch('http://' + config.url + ':' + config.port + '/addPushToken', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            value: token,
            id: id
        }),
      });
    }


    async componentWillMount() {

      if (Platform.OS === "android") {
        Permissions.askAsync(Permissions.NOTIFICATIONS).then(console.log).catch(console.warn);
        // const { status: existingStatus } = await Permissions.getAsync(
        //   Permissions.NOTIFICATIONS
        // ).;
        // let finalStatus = existingStatus;
        //
        // // only ask if permissions have not already been determined, because
        // // iOS won't necessarily prompt the user a second time.
        // if (existingStatus !== 'granted') {
        //   // Android remote notification permissions are granted during the app
        //   // install, so this will only ask on iOS
        //   const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        //   finalStatus = status;
        // }
        //
        // // Stop here if the user did not grant permissions
        // if (finalStatus !== 'granted') {
        //   return;
        // }
      }
    }


    constructor() {
        super();
        this.state = {fontsLoaded: false};
        module.exports.socket = SocketIOClient('http://' + config.url + ':' + config.port);
        AsyncStorage.getItem('user').then(user => {
            this.setState({user: JSON.parse(user)});
            if (user){
                if (Platform.OS === "android") {
                  App.registerForPushNotificationsAsync(JSON.parse(user).id);
                  this._notificationSubscription = Notifications.addListener(this._handleNotification);
                }
                App.socketJoin(JSON.parse(user).id)
            }
        });
    }

    _handleNotification = (notification) => {
      this.setState({notification: notification});
    };


  render() {

        // AsyncStorage.getItem('user').then(user => {
        // let user = user;
        // console.log(user);
    	let RootStack;
      if (this.state.user) {
          RootStack = createStackNavigator({
              Home: Home,
              Login: Login,
              Settings: Settings,
              Signup: Signup,
              AddDevice: AddDevice,
              Alert: Alert
          });
      } else {
          RootStack = createStackNavigator({
              Login: Login,
              Home: Home,
              Settings: Settings,
              Signup: Signup,
              AddDevice: AddDevice,
              Alert: Alert
          });
      }
      return (<RootStack />);
    // });
        // return (
        //   <View style={styles.container}>
        //       <Text>Loading</Text>
        //   </View>
        // );
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  static socketJoin = (id) => {
    module.exports.socket.emit('join', id);
    console.log(`Joining ${id}`);
  }

  static socketLeave = (id) => {
    module.exports.socket.emit('leave', id);
  }

  static onSocket = (event, fn) => {
    module.exports.socket.on(event, fn);
  }
}

// module.exports = {
//   socket: App.socket
// };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#B8EFFF',
    },
});
