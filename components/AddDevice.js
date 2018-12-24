/**
 * Created by Kapil on 19/12/2018.
 */


import React from 'react';
import { Modal, StyleSheet, Text, View, Image, Platform, ScrollView, Button, TextInput, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { styles } from './Styles';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const windowSize = require('Dimensions').get('window')
const deviceWidth = windowSize.width;
const deviceHeight = windowSize.height -1000;
console.log("iaoifjsdofij");
console.log(deviceHeight);

 // const url = "81.133.242.237";
 const url = "192.168.1.108";
 const port = "3000";

export default class AddDevice extends React.Component {

    constructor(){
      super();
      this.state = {locBtnTxt: "Select location", comments: "", deviceid: null, location: null, modalVisible: false, deviceidBorderColour: 'gray', deviceidBorderWidth: 1, commentsBorderColour: 'gray', commentsBorderWidth: 1, mapsAPI: Platform.OS === 'android' ? "AIzaSyCG7LdYiMQIuggXT6enrLRWe7kdSB9S2bc" : "AIzaSyCRf9F6L1Cnrt8O6iwp1cddMqgPYT6Igz0"};
      AsyncStorage.getItem('user').then(user => {
          this.setState({user: JSON.parse(user)});
      });
    }

    _addDevice = () => {
      console.log(this.state.locBtnTxt);
      if (this.state.deviceid && this.state.locBtnTxt !== "Select location")
      {
        fetch('http://'+ url + ':' + port + '/registerDevice', {
          method: 'POST',
          headers: {
              // Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              uid: this.state.deviceid,
              loc: this.state.location,
              comments: this.state.comments,
              user: this.state.user.id
          })
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (res.message === "Created successfully") {
              this.props.navigation.navigate("Home");
            }
          });
      } else {
        if (!this.state.deviceid) {
          this.setState({deviceidBorderColour: 'red', deviceidBorderWidth: 3});
        } else {
          this.setState({deviceidBorderColour: 'gray', deviceidBorderWidth: 1});
        }
      }
    }

    render() {
      return (
        <View style={styles.welcomeContainer}>
            <Text>Add new device{"\n"}</Text>
            <TextInput placeholder="Device ID" autoCapitalize="none"
                       style={{
                height: 40,
                width: "75%",
                borderColor: this.state.deviceidBorderColour,
                borderWidth: this.state.deviceidBorderWidth
            }} onChangeText={(text) => this.setState({deviceid: text})}/>

            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                // Alert.alert('Modal has been closed.');
              }}>
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
                      height: deviceHeight-100,
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
                  renderRightButton={() => <Text>Custom text after the input</Text>}
                />
                </View>
              </View>
            </Modal>

            <Button title={this.state.locBtnTxt} onPress={() => this.setState({modalVisible: true})} />
            <TextInput placeholder="Comments (optional)" style={{
                height: 40,
                width: "75%",
                borderColor: this.state.commentsBorderColour,
                borderWidth: this.state.commentsBorderWidth
            }} onChangeText={(text) => this.setState({comments: text})} />
            <Button title="Add Device" onPress={() => this._addDevice()} />
        </View>
      )
    }
}
