/**
 * Created by Kapil on 04/01/2019.
 */


import React from 'react';
import { Modal, StyleSheet, Text, View, Image, Platform, ScrollView, Button, TextInput, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { styles } from './Styles';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const windowSize = require('Dimensions').get('window');
const deviceWidth = windowSize.width;
const deviceHeight = windowSize.height;
import { config } from '../config';

export default class UpdateDevice extends React.Component {
    static navigationOptions = {
        title: 'Update Device'
    };

    constructor(props){
        super(props);
        console.log(props.navigation.state);
        this.state = {
            locBtnTxt: props.navigation.state.params.alarm.addressName,
            location: {
                lat: props.navigation.state.params.alarm.lat,
                long: props.navigation.state.params.alarm.long
            },
            modalVisible: false,
            nameBorderColor: 'gray',
            nameBorderWidth: 1,
            deviceidBorderColour: 'gray',
            deviceidBorderWidth: 1,
            commentsBorderColour: 'gray',
            commentsBorderWidth: 1,
            mapsAPI: Platform.OS === 'android' ? "AIzaSyCG7LdYiMQIuggXT6enrLRWe7kdSB9S2bc" : "AIzaSyCRf9F6L1Cnrt8O6iwp1cddMqgPYT6Igz0",
            deviceName: props.navigation.state.params.alarm.name,
            deviceUid: props.navigation.state.params.alarm.uid,
            deviceComments: props.navigation.state.params.alarm.comments
        };
        AsyncStorage.getItem('user').then(user => {
            this.setState({user: JSON.parse(user)});
        });
    }

    _updateDevice = () => {
        console.log(this.state);
        if (this.state.locBtnTxt && this.state.deviceName)
        {
            fetch('http://'+ config.url + ':' + config.port + '/updateDevice', {
                method: 'POST',
                headers: {
                    // Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: this.props.navigation.state.params.alarm.id,
                    name: this.state.deviceName,
                    lat: this.state.location.lat,
                    long: this.state.location.long,
                    comments: this.state.deviceComments,
                    addressName: this.state.locBtnTxt
                })
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                    if (res.message === "Success") {
                        this.props.navigation.navigate("Home", {rerender: true});
                    }
                });
        } else {
            if (!this.state.name) {
                this.setState({nameBorderColor: 'red', nameBorderWidth: 3});
            } else {
                this.setState({nameBorderColor: 'gray', nameBorderWidth: 1});
            }
        }
    };

    render() {
        console.log(this.state);
        return (
            <View style={styles.welcomeContainer}>
                <Text>Update device{"\nID:"}{this.props.navigation.state.params.deviceid}{"\n"}</Text>
                <TextInput value={this.state.deviceName} autoCapitalize="sentences"
                           style={{
                               height: 40,
                               width: "75%",
                               borderColor: this.state.nameBorderColor,
                               borderWidth: this.state.nameBorderWidth
                           }} onChangeText={(text) => this.setState({deviceName: text})}/>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        // Alert.alert('Modal has been closed.');
                    }}>
                    <Text>{"\n"}</Text>
                    <View style={{marginTop: 22}}>
                        <View>
                            <GooglePlacesAutocomplete
                                placeholder='Location'
                                minLength={2} // minimum length of text to search
                                autoFocus={false}
                                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                listViewDisplayed='auto'    // true/false/undefined
                                fetchDetails={true}
                                renderDescription={row => row.description} // custom description render
                                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                    // console.log(data);
                                    // console.log(details);
                                    console.log(details.geometry.location);
                                    this.setState({locBtnTxt: details.formatted_address, location: details.geometry.location, modalVisible: false});

                                }}

                                getDefaultValue={() => ''}

                                query={{
                                    // available options: https://developers.google.com/places/web-service/autocomplete
                                    // key: "AIzaSyCG7LdYiMQIuggXT6enrLRWe7kdSB9S2bc",
                                    // key: 'AIzaSyAGF8cAOPFPIKCZYqxuibF9xx5XD4JBb84',
                                    origin: 'http://81.133.242.237:3000',
                                    key: "AIzaSyDl8EMGdAEUSCwTROVXP921Nc_-mKR41Wc",
                                    language: 'en' // language of the results
                                    // types: '(cities)' // default: 'geocode'
                                }}

                                styles={{
                                    textInputContainer: {
                                        width: '100%'
                                    },
                                    description: {
                                        fontWeight: 'bold'
                                    },
                                    predefinedPlacesDescription: {
                                        color: '#1faadb'
                                    },
                                    listView: {
                                        position: 'absolute',
                                        paddingTop: 40,
                                        height: deviceHeight,
                                        width: deviceWidth
                                    }
                                }}

                                currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                                currentLocationLabel="Current location"
                                nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                GoogleReverseGeocodingQuery={{
                                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                                }}
                                GooglePlacesSearchQuery={{
                                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                    rankby: 'distance',
                                    types: 'food'
                                }}

                                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                                // predefinedPlaces={[homePlace, workPlace]}

                                debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                                // renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
                            />
                        </View>
                    </View>
                </Modal>

                <Button title={this.state.locBtnTxt} onPress={() => this.setState({modalVisible: true})} />
                <TextInput value={this.state.deviceComments} style={{
                    height: 40,
                    width: "75%",
                    borderColor: this.state.commentsBorderColour,
                    borderWidth: this.state.commentsBorderWidth
                }} onChangeText={(text) => this.setState({deviceComments: text})} />
                <Button title="Update Device" onPress={() => this._updateDevice()} />
            </View>
        )
    }

}