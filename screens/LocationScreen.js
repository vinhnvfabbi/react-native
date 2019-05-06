import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Modal,
  Linking,
  Alert,
  Button
} from 'react-native';
// import { Button } from 'native-base';
import reverseGeocode from 'latlng-to-zip';
import { Constants, Location, Permissions, IntentLauncherAndroid  } from 'expo';
import { centerScreen } from '../src/css/style';

export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
    isShowEnableLocationModal: false,
    openDeviceSetting: false,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    try {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }

      let location = await Location.getCurrentPositionAsync({});
      this.setState({ location });          
    } catch (error) {
      const status = await Location.getProviderStatusAsync();
      if (!status.locationServicesEnabled) {
        this.setState({ isShowEnableLocationModal: true });
      }
    }

  };

  _openSettingHandler = () => {
    console.log('open setting');
    // if (!this.state.openDeviceSetting) return;
    if (Platform.OS === 'ios') {
      console.log('open iOS setting');
      Linking.openURL('app-settings:');
    } else {
      console.log('open android setting');
      IntentLauncherAndroid.startActivityAsync(IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS);
    }

    this.setState({ openDeviceSetting: false });
  }

  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      const { longitude, latitude } = this.state.location.coords;
      text = `lng: ${longitude}, lat: ${latitude}`;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
        <Modal
          onRequestClose={this._openSettingHandler}
          visible={this.state.isShowEnableLocationModal}
        >
          <View
            style={styles.centerScreen}
          >
            {/* <Button
              bordered
              onPress={() => {
                this.setState({
                  isShowEnableLocationModal: false,
                  openDeviceSetting: true,
                })
              }}
            >
              <Text>Enable location</Text>
            </Button> */}
            <Button
              title="Location"
              onPress={() => {
                this.setState({
                  isShowEnableLocationModal: false,
                  openDeviceSetting: true,
                })
              }}              
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  centerScreen,
});