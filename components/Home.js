/**
 * Created by Kapil on 19/12/2018.
 */

import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage } from 'react-native';
import { styles } from './Styles'

export default class Home extends React.Component {

    componentDidMount() {
        AsyncStorage.getItem('user').then(user => {
            console.log(user);
            this.setState({user: user});
        });
        this.render = this.render.bind(this);
    }

    render() {
        try {
            console.log(this);
            console.log(this.state);
            return (
                <View style={styles.container}>
                    <View style={styles.welcomeContainer}>
                        {/*<Text>Welcome {this.state.user.name}</Text>*/}
                        <Text>Foo</Text>
                    </View>

                    <View style={styles.getStartedContainer}>
                        {/*{this._renderAlarms()}*/}

                    </View>
                </View>
            );
        } catch(e) {
            console.log(e);
            return (
                <View style={styles.container}>
                    <Text>Loading</Text>
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
