/**
 * Created by Kapil on 26/12/2018.
 */

import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, ActivityIndicator, Image } from 'react-native';
import { styles } from './Styles';
import { Icon } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { Font, AppLoading } from 'expo';
import ActionButton from 'react-native-action-button';
import CardView from 'react-native-cardview';
import {RNSlidingButton, SlideDirection} from 'rn-sliding-button';
import { config } from '../config'

export default class Alert extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.navigation.state.params);
    this.state = {alarm: props.navigation.state.params.alarm, time: '5:00'};
    global.alarm = props.navigation.state.params.alarm;

  }

  componentDidMount() {
    // let endTime, now, diff, minutes, seconds, time;
    // do{
    //   setTimeout(function() {
    //     endTime = (new Date(this.state.alarm.updatedAt).getTime()/1000) + (5 * 60);
    //     now = new Date().getTime()/1000;
    //     diff = (endTime - now)/60
    //     minutes = Math.floor(diff);
    //     seconds = Math.floor(diff%60);
    //     if (seconds < 10)
    //     {
    //       seconds = "0" + seconds;
    //     }
    //     time = `${minutes}:${seconds}`;
    //     console.log(time);
    //     this.setState({time: time});
    //   }, 1000);
    // } while(time !== "0:00")
  }


  static navigationOptions = {
    headerLeft: null,
    title: 'Fire Detected',
    gesturesEnabled: false,
  }

  cancelAlarm = () => {
    fetch('http://'+ config.url +':'+ config.port +'/cancelAlarm', {
      method: 'POST',
      headers: {
          // Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          id: this.props.navigation.state.params.alarm.id
      })
    }).then(() => {
      console.log("ainfefn");
      this.props.navigation.navigate('Home');
    })
  }

  render() {
    return (
      <View style={{backgroundColor: 'white'}}>
        <Text style={{color: 'red', fontSize: 25, fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white'}}>FIRE DETECTED IN {global.alarm.name.toUpperCase()}{"\n"}</Text>
        <View style={{alignItems: 'center',justifyContent: 'center'}} >
          <Image source={require('../assets/images/alert.png')}/>
        </View>
        <Text style={{color: 'red', fontSize: 25, fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white'}}>{"\n"}{this.state.time}{"\n"}</Text>
        <RNSlidingButton
          style={{
            width: require('Dimensions').get('window').width,
            backgroundColor: 'red'
          }}
          height={35}
          onSlidingSuccess={this.cancelAlarm}
          slideDirection={SlideDirection.RIGHT}>
          <View style={{alignItems: 'center',justifyContent: 'center'}}>
            <Text numberOfLines={1} style={{color: 'white', fontSize: 25}}>
              SLIDE RIGHT TO CANCEL >
            </Text>
          </View>
        </RNSlidingButton>
      </View>

    );
  }
}
