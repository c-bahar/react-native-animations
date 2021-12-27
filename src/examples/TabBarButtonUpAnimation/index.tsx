import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import CustomButtonTabBar from './customTabBarButton';

import {Colors, TabBarPaddingTop} from './constants';

function HomeScreen() {
  const {screenStyle} = styles;
  return (
    <View style={screenStyle}>
      <Text>Home!</Text>
    </View>
  );
}

function ProfileScreen() {
  const {screenStyle} = styles;

  return (
    <View style={screenStyle}>
      <Text>Profile!</Text>
    </View>
  );
}

function ExploreScreen() {
  const {screenStyle} = styles;

  return (
    <View style={screenStyle}>
      <Text>Explore!</Text>
    </View>
  );
}

function ShareScreen() {
  const {screenStyle} = styles;

  return (
    <View style={screenStyle}>
      <Text>Share!</Text>
    </View>
  );
}

function NotificationScreen() {
  const {screenStyle} = styles;

  return (
    <View style={screenStyle}>
      <Text>Notification!</Text>
    </View>
  );
}

const TabItems = [
  {name: 'Home', component: HomeScreen},
  {name: 'Explore', component: ExploreScreen},
  {name: 'Share', component: ShareScreen},
  {name: 'Notification', component: NotificationScreen},
  {name: 'Profile', component: ProfileScreen},
];

export default function TabBarIconAnimation() {
  const {tabbarStyle} = styles;
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: tabbarStyle,
        }}>
        {TabItems.map(tabItem => {
          return (
            <Tab.Screen
              key={tabItem.name}
              options={{
                tabBarShowLabel: false,
                tabBarButton: props => (
                  <CustomButtonTabBar {...props} name={tabItem.name} />
                ),
              }}
              name={tabItem.name}
              component={tabItem.component}
            />
          );
        })}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  tabbarStyle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: TabBarPaddingTop,
    backgroundColor: Colors.background,
  },
  screenStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
