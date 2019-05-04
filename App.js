import React, { Component } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  // Text,
  // Button
} from 'react-native';
import {
  Container,
  Content,
  Button,
  Text
} from 'native-base';
import {
  createSwitchNavigator,
  createAppContainer,
  createDrawerNavigator,
  createBottomTabNavigator,
  createStackNavigator,
} from 'react-navigation';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';

import { centerScreen } from './src/css/style';

export default class App extends React.Component {
  // state = {
  //   isLoadingComplete: false,
  // };

  // render() {
  //   if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
  //     return (
  //       <AppLoading
  //         startAsync={this._loadResourcesAsync}
  //         onError={this._handleLoadingError}
  //         onFinish={this._handleFinishLoading}
  //       />
  //     );
  //   } else {
  //     return (
  //       <View style={styles.container}>
  //         {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
  //         <AppNavigator />
  //       </View>
  //     );
  //   }
  // }

  // _loadResourcesAsync = async () => {
  //   return Promise.all([
  //     Asset.loadAsync([
  //       require('./assets/images/robot-dev.png'),
  //       require('./assets/images/robot-prod.png'),
  //     ]),
  //     Font.loadAsync({
  //       // This is the font that we are using for our tab bar
  //       ...Icon.Ionicons.font,
  //       // We include SpaceMono because we use it in HomeScreen.js. Feel free
  //       // to remove this if you are not using it in your app
  //       'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
  //     }),
  //   ]);
  // };

  // _handleLoadingError = error => {
  //   // In this case, you might want to report the error to your error
  //   // reporting service, for example Sentry
  //   console.warn(error);
  // };

  // _handleFinishLoading = () => {
  //   this.setState({ isLoadingComplete: true });
  // };

  render () {
    return (
      <AppContainer />
    );
  }
}

class WelcomeScreen extends Component {
  render () {
    return (
      <View
        style={styles.centerScreen}
      >
        <Text>Welcome Screen</Text>
        <View style={styles.rowContainer}>
          <Button
            bordered
            onPress={() => this.props.navigation.navigate('Dashboard')}
          ><Text>Login</Text></Button>
          <Button
            bordered
            onPress={() => alert ('Sign Up')}
          ><Text>Sign Up</Text></Button>
        </View>
      </View>
    );
  }
}

class DashboardScreen extends Component {
  render () {
    return (
      <View
        style={styles.centerScreen}
      >
        <Text>Dashboard Screen</Text>
      </View>
    );
  }
}

class DetailScreen extends Component {
  render () {
    return (
      <View>
        <Text>Detail Screen</Text>
      </View>
    )
  }
}

class Feed extends Component {
  render () {
    return (
      <View
        style={styles.centerScreen}
      >
        <Button
          bordered
          onPress={() => this.props.navigation.navigate('Detail')}
        >
          <Text>Go to detail screen</Text>
        </Button>
      </View>
    );
  }
}

class Profile extends Component {
  render () {
    return (
      <View
        style={styles.centerScreen}
      >
        <Text>Profile Tab</Text>
      </View>
    );
  }
}
class Settings extends Component {
  render () {
    return (
      <View
        style={styles.centerScreen}
      >
        <Text>Settings Tab</Text>
      </View>
    );
  }
}

const FeedStack = createStackNavigator({
  Feed: {
    screen: Feed,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Feed',
        headerLeft: (
          <Icon.Ionicons
            style={{ paddingLeft: 10 }}
            name="md-menu"
            size={30} 
            onPress={() => navigation.openDrawer()}
          />
        )
      }
    }
  },
  Detail: {
    screen: DetailScreen
  }
}, {
  defaultNavigationOptions: {
    gesturesEnabled: false,
  }
});

const ProfileStack = createStackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Profile',
        headerLeft: (
          <Icon.Ionicons
            style={{ paddingLeft: 10 }}
            name="md-menu"
            size={30} 
            onPress={() => navigation.openDrawer()}
          />
        )
      }
    }
  },
});

const SettingStack = createStackNavigator({
  Setting: {
    screen: Settings,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Settings',
        headerLeft: (
          <Icon.Ionicons
            style={{ paddingLeft: 10 }}
            name="md-menu"
            size={30} 
            onPress={() => navigation.openDrawer()}
          />
        )
      }
    }
  },
});

const DashboardBottomTab = createBottomTabNavigator({
  FeedStack,
  ProfileStack,
  SettingStack,
}, {
  navigationOptions: (navObj) => {
    console.log('navigationOptions: ', navObj);
    const { routeName } = navObj.navigation.state.routes[navObj.navigation.state.index];
    return {
      header: null,
      headerTitle: routeName,
    }
  }
});

const DashboardStackNavigator = createStackNavigator({
  DashboardBottomTab
}, {
  defaultNavigationOptions: ({ navigation }) => {
    return {
      headerLeft: (
        <Icon.Ionicons
          style={{ paddingLeft: 10 }}
          name="md-menu"
          size={30} 
          onPress={() => navigation.openDrawer()}
        />
      )
    }
  }
});

const AppDrawerNavigator = createDrawerNavigator({
  Dashboard: {
    screen: DashboardStackNavigator
  }
});

const AppSwitchNavigator = createSwitchNavigator({
  Welcome: {
    screen: WelcomeScreen
  },
  Dashboard: {
    screen: AppDrawerNavigator
  }
});

const AppContainer = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerScreen
});
