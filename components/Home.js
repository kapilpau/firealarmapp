/**
 * Created by Kapil on 19/12/2018.
 */

import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, ActivityIndicator, TouchableOpacity } from 'react-native';
import PTRView from 'react-native-pull-to-refresh';
import { styles } from './Styles';
import { Icon, Card } from 'react-native-elements';
import { Font, AppLoading } from 'expo';
import ActionButton from 'react-native-action-button';
import { NavigationEvents } from 'react-navigation';
import App from '../App';
import { config } from '../config'

export default class Home extends React.Component {


    static navigationOptions = ({navigation}) => {
      if (navigation.state.params)
      {
        return {
          title: 'Home',
          headerLeft: null,
          headerRight: navigation.state.params.header,
          gesturesEnabled: false
        }
      } else {
        return {
          title: 'Fire Alarm',
          headerLeft: null,
          gesturesEnabled: false
        }
      }

    };

    async componentWillMount() {
      await Font.loadAsync({ 'MaterialIcons': require('@expo/vector-icons/fonts/MaterialIcons.ttf') })
        .then(() => {
          this.setState({fontsLoaded: true}, () =>
              {
                this.props.navigation.setParams({header: (
                  <Icon
                    name='settings'
                    type='AntDesign'
                    onPress={() => this.props.navigation.navigate("Settings")}
                  />
                )})
              }
            );
        });
     }

    constructor(props) {
        super(props);
        props.navigation.setParams({header: null});
        this.state = {fontsLoaded: false, alarms:[], open: false};
        App.onSocket('trigger', function(msg) {
            props.navigation.navigate('Alert', {alarm: JSON.parse(msg), vibrate: true});
        });
    }


    componentDidMount() {
        global.opts = this;
        AsyncStorage.getItem('user').then(user => {
      	    global.user = JSON.parse(user);
            this.setState({user: JSON.parse(user)});
            this._renderAlarms();
      	    global.opts = this;
      	}).catch(err => console.log(err));

        this.render = this.render.bind(this);
    }

    render() {
      let user = global.user;
        if (user)
        {
          let Alarms = this.state.alarms.map((alarm) => {
            if (!alarm.comments){
                alarm.comments = "";
            }
            let circleColour = 'green';
            let circleSize = 20;
            if (alarm.status === "warning"){
              circleColour = '#FFBF00';
            } else if (alarm.status === "error" || alarm.status === "triggered" || alarm.status === "triggered") {
              circleColour = 'red';
            }
            if (alarm.status === "triggered" || alarm.status === "triggered") {
                return (

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Alert', {alarm: alarm, vibrate: false})}
                        style={{
                            width: '100%',
                            paddingLeft: '5%'
                        }}
                    >
                        <Card
                            key={alarm.id}
                            containerStyle={{
                                justifyContent: 'center',
                                margin: 2,
                                backgroundColor: 'white',
                                width: '90%',
                                paddingTop: 10,
                                paddingLeft: '5%',
                                paddingRight: '5%',
                                marginBottom: 30
                            }}
                        >
                            <View>
                                <View
                                    style={{
                                        right: '5%'
                                    }}
                                >
                                    <Text style={{fontSize: 20}}>
                                        {alarm.name + "\n"}
                                    </Text>
                                    <Text style={{fontSize: 13}}>
                                        {alarm.addressName + "\n"}
                                    </Text>
                                    <Text style={{fontSize: 15}}>
                                        {alarm.comments + "\n"}
                                    </Text>
                                </View>
                                <View style={{
                                    width: circleSize,
                                    height: circleSize,
                                    borderRadius: circleSize / 2,
                                    position: 'absolute',
                                    right: '1%',
                                    top: '30%',
                                    backgroundColor: circleColour
                                }}/>
                            </View>
                        </Card>
                    </TouchableOpacity>
                );
            } else {
                return (
                        <Card
                            key={alarm.id}
                            containerStyle={{
                                justifyContent: 'center',
                                margin: 2,
                                backgroundColor: 'white',
                                width: '90%',
                                paddingTop: 10,
                                paddingLeft: '5%',
                                marginBottom: 30
                            }}
                        >
                            <View>
                                <View
                                    style={{
                                        right: '5%'
                                    }}
                                >
                                    <Text style={{fontSize: 20}}>
                                        {alarm.name + "\n"}
                                    </Text>
                                    <Text style={{fontSize: 13}}>
                                        {alarm.addressName + "\n"}
                                    </Text>
                                    <Text style={{fontSize: 15}}>
                                        {alarm.comments + "\n"}
                                    </Text>
                                </View>
                                <View style={{
                                    width: circleSize,
                                    height: circleSize,
                                    borderRadius: circleSize / 2,
                                    position: 'absolute',
                                    right: '1%',
                                    top: '30%',
                                    backgroundColor: circleColour
                                }}/>
                            </View>
                        </Card>
                );
            }
          });
          try {
                return (
                    <View style={styles.container}>
                        <NavigationEvents
                            onDidFocus={payload => this._renderAlarms()}
                        />
                        <PTRView onRefresh={() => {this._renderAlarms()}} >
                        <View style={styles.welcomeContainer}>
                        { Alarms }
                         </View>
                        </PTRView>
                         <ActionButton
                            buttonColor="rgba(0,0,255,1)"
                            onPress={() => { this.props.navigation.navigate("AddDevice") }}
                          />
                     </View>
                 );
             } catch(e) {
                 console.log(JSON.stringify(e));
                 return (
                     <View style={styles.container}>
                         <Text>Loading caught</Text>
                     </View>
                 );
             }
         } else {
           return (
             <ActivityIndicator
               animating={true}
               style={styles.indicator}
               size="large"
             />
            );
         }
    }

    _renderAlarms() {
        const obj = this;
        const user = this.state.user;
        return new Promise(function (resolve, reject) {
            fetch('http://' + config.url + ':' + config.port + '/getDevices/' + user.id, {
                method: 'GET',
                headers: {
                    // Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.message !== "No alarms") {
                        obj.setState({alarms: res.alarms});
                    }
                    resolve(res.alarms);
                }).catch(e => {
                    console.log(e);
                    reject(e);
            })
        });
    }

};
