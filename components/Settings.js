/**
 * Created by Kapil on 19/12/2018.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { styles } from './Styles'

export default class Settings extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Hello from settings!</Text>
            </View>
        );
    }
};
