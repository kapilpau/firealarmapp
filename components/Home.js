/**
 * Created by Kapil on 19/12/2018.
 */

import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, ActivityIndicator } from 'react-native';
import { styles } from './Styles';
import { Icon } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { Font, AppLoading } from 'expo';
import ActionButton from 'react-native-action-button';
import CardView from 'react-native-cardview';
import App from '../App'
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

    }

    async componentWillMount() {
      console.log("cWM");
      await Font.loadAsync({ 'Material Icons': require('@expo/vector-icons/fonts/MaterialIcons.ttf') })
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
          // this.forceReload();
        });
        // this.setState({});
       await Font.loadAsync(MaterialIcons.font)

     }

    constructor(props) {
        super(props);
        console.log("Const");
        props.navigation.setParams({header: null});
        this.state = {fontsLoaded: false, alarms:[], open: false};
        App.onSocket('message', function(msg) {
            // console.log(msg);
            props.navigation.navigate('Alert', {alarm: JSON.parse(msg)});
            // alert(msg);
        });
        // App.socket.on('message', function(msg) {
        //     <Alert />;
        //     alert(msg);
        // });
    }


    componentDidMount() {
      console.log("cDM");
        global.opts = this;
        AsyncStorage.getItem('user').then(user => {
      	    global.user = JSON.parse(user);
            this.setState({user: JSON.parse(user)});
            this._renderAlarms(user);
      	    global.opts = this;
      	}).catch(err => console.log(err));

        this.render = this.render.bind(this);
    }

    render() {
      let user = global.user;
        if (user)
        {
          let Alarms = this.state.alarms.map((alarm) => {
            let circleColour = 'green';
            let circleSize = 20;
            if (alarm.status === "warning"){
              circleColour = '#FFBF00';
            } else if (alarm.status === "error" || alarm.status === "triggered") {
              circleColour = 'red';
            }
            return (
                <CardView
                  cardElevation={3}
                  cardMaxElevation={2}
                  cornerRadius={5}
                   paddingBottom={10}
                   style={{
                     justifyContent:'center',
                     margin:2,
                     backgroundColor:'white',
                     width: '90%',
                     paddingTop: 10,
                     paddingLeft: 5,
                     marginBottom: 30
                   }}
                 >
                    <View>
                      <Text style={{fontSize:20}}>
                        {alarm.name + "\n"}
                      </Text>
                      <View style={{
                            width: circleSize,
                            height: circleSize,
                            borderRadius: circleSize/2,
                            position: 'absolute',
                            right: '5%',
                            top: '30%',
                            backgroundColor: circleColour
                        }}/>
                      <Text style={{fontSize: 15}}>
                        {alarm.comments + "\n"}
                      </Text>
                    </View>
                </CardView>
                          );
          });
            try {
                return (
                    <View style={styles.container}>
                        <View style={styles.welcomeContainer}>
                        { Alarms }
                         </View>
                         <ActionButton
                            buttonColor="rgba(0,0,255,1)"
                            onPress={() => { this.props.navigation.navigate("AddDevice") }}
                          />
                     </View>
                 );
             } catch(e) {
                 console.log(e);
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

    _renderAlarms(user) {
        fetch('http://' + config.url + ':'+ config.port + '/getDevices/' + JSON.parse(user).id, {
          method: 'GET',
          headers: {
              // Accept: 'application/json',
              'Content-Type': 'application/json',
          }
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.message === "No alarms") {
              return;
            } else {
              this.setState({alarms: res.alarms});
            }
          })
    }

};
