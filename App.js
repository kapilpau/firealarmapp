import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { AsyncStorage } from "react-native";
import Home from './components/Home'
import Login from './components/Login'
import Settings from './components/Settings'
import Signup from './components/Signup'
import { createStackNavigator } from 'react-navigation'


export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

    componentDidMount() {
        // let user = {id:1, username:"kaps_1997", email:"kaps_1997@yahoo.com", password:"Pass", name:"Kapil Pau", createdAt:"2018-12-18T16:55:33.000Z", updatedAt:"2018-12-18T16:55:33.000Z"}
        // AsyncStorage.setItem('user', JSON.stringify(user));
        // AsyncStorage.getItem('user').then(user => {
        //     this.setState({user: user});
        //     console.log(this.state)
        // });
    }

  render() {
        // alert(JSON.stringify(this.state));
        let RootStack;
      if (this.state.user) {
          RootStack = createStackNavigator({
              Home: Home,
              Login: Login,
              Settings: Settings,
              Signup: Signup
          });
      } else {
          RootStack = createStackNavigator({
              Login: Login,
              Home: Home,
              Settings: Settings,
              Signup: Signup
          });
      }
        try {
            return <RootStack />;
        } catch (e) {
              console.log(e);
            return (
                <View style={styles.container}>
                    <Text>Loading</Text>
                </View>
            )
        }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#B8EFFF',
    },
});