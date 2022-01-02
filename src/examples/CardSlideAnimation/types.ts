import Animated from 'react-native-reanimated';
import {ImageSourcePropType} from 'react-native';

export type CardItemType = {
  title: string;
  image: ImageSourcePropType;
};

export type CardItemProps = {
  item: CardItemType;
  shuffleBack: Animated.SharedValue<boolean>;
  index: number;
};
