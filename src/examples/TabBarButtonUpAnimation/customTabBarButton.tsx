import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Colors, TabBarPaddingTop} from './constants';

import {Measure} from './types';

import {
  Search,
  HomeOutline,
  PersonOutline,
  PlusCircleOutline,
  Notification,
} from './constants';

import Animated, {
  withTiming,
  useAnimatedRef,
  useAnimatedStyle,
  interpolateColor,
  useSharedValue,
  interpolate,
  withSequence,
  Extrapolation,
} from 'react-native-reanimated';

const Icons = {
  Home: HomeOutline,
  Profile: PersonOutline,
  Share: PlusCircleOutline,
  Explore: Search,
  Notification: Notification,
};

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTextView = Animated.createAnimatedComponent(Text);

const CustomButtonTabBar = (props: any) => {
  const {onPress, accessibilityState, name} = props;
  const [measure, setMeasure] = useState<Measure | null>(null);
  const animationValue = useSharedValue(0);
  const animateRef = useAnimatedRef<View>();
  const focused = accessibilityState.selected;

  const {
    tabbarButtonContainer,
    tabbarIconContainer,
    tabbarIconBackground,
    tabbarText,
    flexFull,
  } = styles;

  const Icon = Icons[name];

  useEffect(() => {
    if (focused) {
      animationValue.value = withSequence(
        withTiming(0.5, {duration: 100}),
        withTiming(1, {duration: 100}),
      );
    } else {
      animationValue.value = 0;
    }
  }, [focused]);

  const animateIconContainer = useAnimatedStyle(() => {
    const animatedIconContainerPosition = interpolate(
      animationValue.value,
      [0, 0.5, 0],
      getTranslateYMeasureValueForIcon(measure),
      Extrapolation.CLAMP,
    );

    const animatedIconContainerScale = interpolate(
      animationValue.value,
      [0, 1, 0],
      [1, 1.1, 1],
    );

    return {
      transform: [
        {
          translateY: withTiming(animatedIconContainerPosition),
        },
        {scale: withTiming(animatedIconContainerScale)},
      ],
    };
  });

  const animateIconBackgroundColor = useAnimatedStyle(() => {
    const animatedIconBackgroundColor = interpolateColor(
      animationValue.value,
      [0, 0.5, 0],
      [Colors.background, Colors.primary, Colors.background],
    );

    return {
      backgroundColor: animatedIconBackgroundColor,
    };
  });

  const animateText = useAnimatedStyle(() => {
    const animatedTextScale = interpolate(
      animationValue.value,
      [0, 1, 0],
      [0, 1, 0],
      Extrapolation.IDENTITY,
    );

    const animatedTextPosition = interpolate(
      animationValue.value,
      [0, 1, 0],
      getTranslateYMeasureValueForText(measure),
    );

    return {
      transform: [
        {translateY: withTiming(animatedTextPosition)},
        {scale: withTiming(animatedTextScale)},
      ],
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={tabbarButtonContainer}>
      <AnimatedView
        ref={animateRef}
        onLayout={event => {
          const {height, y} = event.nativeEvent.layout;
          setMeasure({y, height});
        }}
        style={[animateIconContainer, tabbarIconContainer]}>
        <AnimatedView
          style={[animateIconBackgroundColor, tabbarIconBackground]}>
          <Icon
            style={flexFull}
            fill={focused ? Colors.background : Colors.primary}
          />
        </AnimatedView>
      </AnimatedView>
      <AnimatedTextView style={[tabbarText, animateText]}>
        {name}
      </AnimatedTextView>
    </TouchableOpacity>
  );
};

export default CustomButtonTabBar;

const getTranslateYMeasureValueForText = (measure: Measure | null) => {
  'worklet';
  return measure ? [0, -measure?.y - measure?.height / 2 - 5, 0] : [0, 0, 0];
};

const getTranslateYMeasureValueForIcon = (measure: Measure | null) => {
  'worklet';
  return measure
    ? [0, -measure?.y - measure?.height / 2 - TabBarPaddingTop, 0]
    : [0, 0, 0];
};

const styles = StyleSheet.create({
  tabbarButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabbarIconContainer: {
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderColor: Colors.background,
    width: 37,
    height: 37,
  },
  tabbarIconBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 150,
    padding: 5,
  },
  tabbarText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '400',
  },
  flexFull: {
    flex: 1,
  },
});
