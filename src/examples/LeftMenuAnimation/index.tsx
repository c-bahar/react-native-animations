import React, {useRef, useEffect, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  FadeIn,
  useAnimatedRef,
  withTiming,
  Easing,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

import {
  HeaderProps,
  Measure,
  LeftMenuIndicatorProps,
  LeftMenuItemProps,
  ListItemProps,
  LeftMenuContainerProps,
  ListTabContainerProps,
} from './types';

import {Colors, ListItems, menuItems} from './constants';

const setPositionsBreakpointsForIndicatorColorAnimation = (
  index: number,
  contentLength: number,
) => {
  if (index === contentLength - 1) {
    return [index * TAB_WIDTH];
  } else {
    const values = [
      index * TAB_WIDTH,
      index * TAB_WIDTH + 1,
      index * TAB_WIDTH + TAB_WIDTH - 1,
    ];
    return values;
  }
};

const setColorsForIndicatorColorAnimations = (
  index: number,
  contentLength: number,
) => {
  if (index === contentLength - 1) {
    return [Colors.indicatorBackgroundInactive];
  } else {
    const values = [
      Colors.indicatorBackgroundInactive,
      Colors.indicatorBackgroundActive,
      Colors.indicatorBackgroundActive,
    ];
    return values;
  }
};

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('screen');

const INDICATOR_CONTAINER_SIZE = 25;
const INDICATOR_SIZE = 15;

const LEFT_MENU_WIDTH = SCREEN_WIDTH / 9;

const TAB_WIDTH: number = SCREEN_WIDTH - SCREEN_WIDTH / 9;

const AnimatedView = Animated.createAnimatedComponent(View);

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Header = ({headerIndex}: HeaderProps) => {
  const {top} = useSafeAreaInsets();
  const {header, headerText} = styles;

  return (
    <AnimatedView
      style={[
        header,
        {
          paddingTop: top || 10,
        },
      ]}>
      <Text style={headerText}>{menuItems[headerIndex].text}</Text>
    </AnimatedView>
  );
};

const LeftMenuContainer = React.forwardRef(
  ({setTabScrollX}: LeftMenuContainerProps, ref: React.Ref<View>) => {
    const {menuContainer} = styles;
    return (
      <View ref={ref} style={menuContainer}>
        {menuItems.map((menuItem, index) => (
          <LeftMenuItem
            item={menuItem}
            ref={menuItem.ref}
            setTabScrollX={setTabScrollX}
            index={index}
            key={menuItem.text}
          />
        ))}
      </View>
    );
  },
);

const LeftMenuItem = React.forwardRef(
  ({item, setTabScrollX, index}: LeftMenuItemProps, ref: React.Ref<View>) => {
    const {menuItemContainer, tabItem, tabItemText} = styles;

    const menuItemWidth = 12 * item.text.length;

    const OFFSET = menuItemWidth / 2 - LEFT_MENU_WIDTH / 2;

    const scrollToScreen = () => {
      setTabScrollX(index * TAB_WIDTH);
    };

    return (
      <View style={[menuItemContainer, {height: menuItemWidth}]}>
        <TouchableOpacity
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}
          onPress={() => scrollToScreen()}>
          <View
            ref={ref}
            style={[
              tabItem,
              {
                transform: [{rotate: '-90deg'}, {translateY: -OFFSET}],
                width: menuItemWidth,
              },
            ]}>
            <Text style={tabItemText} numberOfLines={1}>
              {item.text}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  },
);

const LeftMenuIndicator = ({
  tabScrollX,
  measuresData,
}: LeftMenuIndicatorProps) => {
  const {y: firstObjectYCoordinate} = measuresData[0] || {};
  const {indicatorContainerSize, indicatorContainer, indicator} = styles;

  const animationInputRange = [0, TAB_WIDTH, TAB_WIDTH * 2];
  const animationOutputRange = measuresData.map((item: any) => {
    return item.y;
  });

  const isOutputRangeReady = () => {
    'worklet';
    return animationOutputRange.length === 0;
  };

  const indicatorPosition = useAnimatedStyle(() => {
    if (isOutputRangeReady()) {
      return {transform: [{translateY: 0}]};
    }
    const animatedindicator = interpolate(
      tabScrollX.value,
      animationInputRange,
      animationOutputRange,
    );

    return {transform: [{translateY: animatedindicator}]};
  });

  const inputRangeForAnimatedColors: number[] = [];
  const outputRangeForAnimatedColors: string[] = [];

  const pushColorsAndValuesForIndicator = (index: number) => {
    inputRangeForAnimatedColors.push(
      ...setPositionsBreakpointsForIndicatorColorAnimation(
        index,
        menuItems.length,
      ),
    );
    outputRangeForAnimatedColors.push(
      ...setColorsForIndicatorColorAnimations(index, menuItems.length),
    );
  };

  menuItems.forEach((_, index) => pushColorsAndValuesForIndicator(index));

  const indicatorBackgroundColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      tabScrollX.value,
      inputRangeForAnimatedColors,
      outputRangeForAnimatedColors,
    );
    return {backgroundColor};
  });

  if (measuresData.length === 0 || firstObjectYCoordinate === 0) {
    return <View style={indicatorContainerSize} />;
  }

  return (
    <AnimatedView
      entering={FadeIn.duration(1000)}
      style={[indicatorPosition, indicatorContainerSize, indicatorContainer]}>
      <Animated.View style={[indicatorBackgroundColor, indicator]} />
    </AnimatedView>
  );
};

const ListTabContainer = React.forwardRef(
  ({tabScrollX}: ListTabContainerProps, ref: React.Ref<FlatList>) => {
    const {tabContainer, widthFull} = styles;
    const {bottom} = useSafeAreaInsets();

    const scrollHandler = useAnimatedScrollHandler(event => {
      tabScrollX.value = withTiming(event.contentOffset.x, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      });
    });

    return (
      <View style={[tabContainer]}>
        <AnimatedFlatList
          ref={ref}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
          bounces={false}
          onScroll={scrollHandler}
          data={menuItems}
          renderItem={({index}) => {
            return (
              <View style={{width: TAB_WIDTH}}>
                <Header headerIndex={index} />
                <FlatList
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[widthFull, {paddingBottom: bottom}]}
                  data={ListItems}
                  renderItem={({item}) => (
                    <ListItem key={item.id} item={item} />
                  )}
                />
              </View>
            );
          }}
        />
      </View>
    );
  },
);

const ListItem = ({item}: {item: ListItemProps}) => {
  const {
    listItemContainer,
    listItemHeader,
    listItemImage,
    listItemDescription,
    flexFull,
  } = styles;
  return (
    <View style={listItemContainer}>
      <Image
        style={listItemImage}
        resizeMode="cover"
        source={{uri: item.image}}
      />
      <View style={flexFull}>
        <Text numberOfLines={1} style={listItemHeader}>
          {item.header}
        </Text>
        <Text numberOfLines={3} style={listItemDescription}>
          {item.detail}
        </Text>
      </View>
    </View>
  );
};

const LeftMenuAnimationScreen = () => {
  const tabScrollX = useSharedValue(0);
  const flatlistRef = useAnimatedRef<FlatList>();
  const containerRef = useRef<View>(null);
  const [measuresData, setMeasuresData] = useState<Measure[]>([]);

  const {screenContainer} = styles;

  const setTabScrollX = (value: number) => {
    flatlistRef?.current?.scrollToOffset({
      offset: value,
    });
  };

  useEffect(() => {
    let measures: Measure[] = [];
    menuItems.forEach((item: any) => {
      item.ref.current.measureLayout(
        containerRef.current,
        (x: number, y: number, width: number, height: number) => {
          let measure: Measure = {x, y, width, height};
          measures.push(measure);
          if (measures.length === menuItems.length) {
            setMeasuresData(measures);
          }
        },
      );
    });
  }, []);

  return (
    <View style={screenContainer}>
      <StatusBar hidden />
      <LeftMenuContainer setTabScrollX={setTabScrollX} ref={containerRef} />
      <LeftMenuIndicator tabScrollX={tabScrollX} measuresData={measuresData} />
      <ListTabContainer tabScrollX={tabScrollX} ref={flatlistRef} />
    </View>
  );
};

export default LeftMenuAnimationScreen;

const styles = StyleSheet.create({
  indicatorContainerSize: {
    width: INDICATOR_CONTAINER_SIZE,
    height: INDICATOR_CONTAINER_SIZE,
  },
  indicatorContainer: {
    backgroundColor: Colors.indicatorContainerBackgroundColor,
    borderRadius: INDICATOR_CONTAINER_SIZE / 2,
    left: SCREEN_WIDTH / 9 - INDICATOR_CONTAINER_SIZE / 3,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  indicator: {
    height: INDICATOR_SIZE,
    width: INDICATOR_SIZE,
    borderRadius: INDICATOR_SIZE / 2,
  },
  menuContainer: {
    height: SCREEN_HEIGHT,
    width: LEFT_MENU_WIDTH,
    position: 'absolute',
    backgroundColor: Colors.leftMenu,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30,
    zIndex: 1,
  },
  screenContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  tabContainer: {
    marginLeft: SCREEN_WIDTH / 9 - INDICATOR_CONTAINER_SIZE,
    width: TAB_WIDTH,
    zIndex: 1,
  },
  menuItemContainer: {
    width: LEFT_MENU_WIDTH,
    justifyContent: 'center',
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItemText: {
    color: Colors.leftMenuText,
    fontWeight: '500',
    fontSize: 17,
  },
  listItemImage: {
    width: SCREEN_WIDTH / 5,
    height: SCREEN_WIDTH / 5,
    borderRadius: 5,
    marginRight: 10,
  },
  listItemContainer: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    marginRight: 10,
    flexDirection: 'row',
    marginLeft: INDICATOR_CONTAINER_SIZE - INDICATOR_CONTAINER_SIZE / 3,
    marginHorizontal: 0,
    borderBottomColor: 'rgba(50,50,50, 0.5)',
    marginVertical: 5,
    alignItems: 'center',
  },
  listItemHeader: {
    fontWeight: '600',
    color: Colors.itemHeader,
    fontSize: 17,
  },
  listItemDescription: {
    fontWeight: '400',
    color: Colors.itemDescription,
    fontSize: 15,
    marginTop: 5,
  },
  headerText: {
    fontWeight: '500',
    color: Colors.headerTextColor,
    fontSize: 28,
  },
  header: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: Colors.headerBorderColor,
    backgroundColor: Colors.headerBackground,
  },
  flexFull: {
    flex: 1,
  },
  widthFull: {
    width: '100%',
  },
});
