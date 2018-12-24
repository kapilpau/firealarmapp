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

export default class Home extends React.Component {

    static navigationOptions = ({navigation}) => {
      if (navigation.state.params)
      {
        return {
          title: 'Home',
          headerLeft: null,
          headerRight: navigation.state.params.header
        }
      } else {
        return {
          title: 'Fire Alarm',
          headerLeft: null
        }
      }

    }

    async componentWillMount() {
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
       await Font.loadAsync(MaterialIcons.font)

     }

    constructor(props) {
        super(props);
        this.state = {fontsLoaded: false}
        this.render = this.render.bind(this);
        props.navigation.setParams({header: null});
    }

    componentDidMount() {
        global.opts = this;
        AsyncStorage.getItem('user').then(user => {
	    global.user = JSON.parse(user);
            this.setState({user: JSON.parse(user)});
	    global.opts = this;
	}).catch(err => console.log(err));

        this.render = this.render.bind(this);
    }

    render() {
      let user = global.user;
        if (user)
        {
            try {
                return (
                    <View style={styles.container}>
                        <View style={styles.welcomeContainer}>
                            <Text>Welcome {user.name}</Text>
                        </View>

                        <View style={styles.getStartedContainer}>
                          {this._renderAlarms()}
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

    _renderAlarms() {
        var alarmList = [
            <Text>
                Your alarms
            </Text>
        ];
        var alarm;
        console.log("User: " + this.state.user.id);

        /* TODO: Add db pull */

        return (
            <View></View>

        );

    }

};
