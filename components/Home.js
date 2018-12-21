/**
 * Created by Kapil on 19/12/2018.
 */

import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage } from 'react-native';
import { styles } from './Styles'

export default class Home extends React.Component {

    constructor() {
        super();
	        this.render = this.render.bind(this);
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
	console.log("Global opts:");
        let user = global.user;
	console.log(user);
        if (user)
        {
            try {
                console.log(user);
                return (
                    <View style={styles.container}>
                        <View style={styles.welcomeContainer}>
                            <Text>Welcome {user.name}</Text>
                        </View>

                        <View style={styles.getStartedContainer}>

                         </View>
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
                <View style={styles.container}>
                    <Text>Loading else</Text>
                </View>
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
            <View>{alarmList}</View>

        );

    }

};
