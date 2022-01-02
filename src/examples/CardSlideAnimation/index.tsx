import React, {useEffect} from 'react';

import {StyleSheet, View, Image, Dimensions} from 'react-native';

import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

import Animated, {
  AnimatableValue,
  Easing,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {CardItemProps} from './types';
import {CardData, Colors} from './constants';

const AnimatedView = Animated.createAnimatedComponent(View);

const {height: screenHeight, width: screenWidth} = Dimensions.get('screen');

const IMAGE_HEIGHT = screenHeight * 0.6;
const IMAGE_WIDTH = screenWidth * 0.7;
const DURATION = 250;

const CardSlideAnimation = () => {
  const {container} = styles;
  const shuffleBack = useSharedValue(false);

  const FurnitureList = CardData.map((furnitureItem, index) => {
    return (
      <CardItem
        key={furnitureItem.title}
        index={index}
        item={furnitureItem}
        shuffleBack={shuffleBack}
      />
    );
  });

  return <View style={container}>{FurnitureList}</View>;
};

const CardItem = ({item, shuffleBack, index}: CardItemProps) => {
  const {cardItemContainer, imageContainerStyle, imageStyle, cardContainer} =
    styles;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(-screenHeight);
  const rotateZ = useSharedValue(0);
  const scale = useSharedValue(1);
  const delay = index * DURATION;
  const angleZ = -7.5 + Math.random() * 15;

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(0, {easing: Easing.inOut(Easing.ease)}),
    );
    rotateZ.value = withDelay(delay, withSpring(angleZ));
  }, [delay, index, rotateZ, angleZ, translateY]);

  const setScaleValue = () => {
    'worklet';
    scale.value = scale.value === 1.1 ? withTiming(1) : withTiming(1.1);
  };

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {x: number; y: number}
  >({
    onStart: (_, ctx) => {
      ctx.x = translateX.value;
      ctx.y = translateY.value;
      rotateZ.value = withTiming(0);
      setScaleValue();
    },
    onActive: ({translationX, translationY}, ctx) => {
      translateX.value = ctx.x + translationX;
      translateY.value = ctx.y + translationY;
      setScaleValue();
    },
    onEnd: () => {
      const cardPositionValue: AnimatableValue = getTargetPosition(translateX);
      translateX.value = withTiming(cardPositionValue, {
        duration: 700,
      });
      translateY.value = withSpring(0);
      scale.value = withTiming(1, {}, () => {
        const isLast = index === 0;
        const isLeftSide = cardPositionValue > 0 ? true : false;
        const isSwipedLeftOrRight = isLeftSide === true || isLeftSide === false;
        if (isLast && isSwipedLeftOrRight) {
          shuffleBack.value = true;
        }
      });
    },
  });

  useAnimatedReaction(
    () => shuffleBack.value,
    v => {
      if (v) {
        const duration = 150 * index;
        translateX.value = withDelay(
          duration,
          withSpring(0, {damping: 20, mass: 5, stiffness: 70}, () => {
            shuffleBack.value = false;
          }),
        );
        rotateZ.value = withDelay(duration, withSpring(angleZ));
      }
    },
  );

  const animatePosition = useAnimatedStyle(() => ({
    transform: [
      {perspective: 1500},
      {rotateX: '10deg'},
      {translateX: translateX.value},
      {translateY: translateY.value},
      {rotateY: `${rotateZ.value / 10}deg`},
      {rotateZ: `${rotateZ.value}deg`},
      {scale: scale.value},
    ],
  }));

  return (
    <View style={cardContainer} pointerEvents="box-none">
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <AnimatedView style={[animatePosition, cardItemContainer]}>
          <AnimatedView style={imageContainerStyle}>
            <Image resizeMode="cover" style={imageStyle} source={item.image} />
          </AnimatedView>
        </AnimatedView>
      </PanGestureHandler>
    </View>
  );
};

const getTargetPosition = (
  translateX: Animated.SharedValue<number>,
): AnimatableValue => {
  'worklet';

  const imageHalfWidthForLeft = -IMAGE_WIDTH / 2;
  const imageHalfWidthForRight = IMAGE_WIDTH / 2;
  const currentXValue = translateX.value;

  if (currentXValue < imageHalfWidthForLeft) {
    return -screenWidth / 2 - screenWidth * 0.7;
  } else if (currentXValue > imageHalfWidthForRight) {
    return screenWidth / 2 + screenWidth * 0.7;
  } else {
    return 0;
  }
};

export default CardSlideAnimation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardItemContainer: {
    height: IMAGE_HEIGHT,
    width: IMAGE_WIDTH,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainerStyle: {
    flex: 1,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  detailContainer: {
    paddingTop: 10,
  },
});
