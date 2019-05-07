import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  StyleSheet,
  // Modal,
  Linking,
  Alert,
  Button,
  AppState
} from 'react-native';
import Modal from 'react-native-modal';
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
    appState: AppState.currentState
  };

  componentWillMount() {
    AppState.addEventListener('change', this._handlerAppStateChange);
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handlerAppStateChange);
  }

  _handlerAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      this._getLocationAsync();
    }
    this.setState({appState: nextAppState});
  }

  _getLocationAsync = async () => {
    try {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });

        return;
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
    if (!this.state.openDeviceSetting) return undefined;
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
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
          onModalHide={this._openSettingHandler}
          isVisible={this.state.isShowEnableLocationModal}
        >
          <View
            style={styles.centerScreen}
          >
            <Button
              title="Enable Location"
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