import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { AppLoading, Asset, Font, Icon, Permissions, Notifications } from 'expo';
import { AsyncStorage } from "react-native";
import Home from './components/Home';
import Login from './components/Login';
import Settings from './components/Settings';
import Signup from './components/Signup';
import AddDevice from './components/AddDevice';
import RegisterDevice from './components/RegisterDevice';
import UpdateDevice from './components/UpdateDevice';
import Update from './components/Update';
import SocketIOClient from 'socket.io-client';
import Alert from './components/Alert';
import { config } from './config'
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { MenuProvider } from 'react-native-popup-menu';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

    async componentWillMount() {

      if (Platform.OS === "android") {
        Notifications.addEventListener(this._handleNotification);
      }
    }


    constructor() {
        super();
        this.state = {fontsLoaded: false};
        module.exports.socket = SocketIOClient('http://' + config.url + ':' + config.port);
        AsyncStorage.getItem('user').then(user => {
            this.setState({user: JSON.parse(user)});
            if (user){
                App.socketJoin(JSON.parse(user).id)
            }
        });
    }

    _handleNotification = (notification) => {
      alert(JSON.stringify(notification));
      Home.alarmTriggered(JSON.parse(notification.alarm));
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
              RegisterDevice: RegisterDevice,
              UpdateDevice: UpdateDevice,
              Update: Update,
              Alert: Alert
          });
      } else {
          RootStack = createStackNavigator({
              Login: Login,
              Home: Home,
              Settings: Settings,
              Signup: Signup,
              AddDevice: AddDevice,
              RegisterDevice: RegisterDevice,
              UpdateDevice: UpdateDevice,
              Update: Update,
              Alert: Alert
          });
      }
      return (
          <MenuProvider>
              <RootStack />
          </MenuProvider>
      );
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
