import {createRef} from 'react';
import {View} from 'react-native';

import {ListItemProps} from './types';

export const menuItems = [
  {text: 'Want to read', ref: createRef<View>()},
  {text: 'Reading Now', ref: createRef<View>()},
  {text: 'Finished', ref: createRef<View>()},
  {text: 'Read Again', ref: createRef<View>()},
];

export const ListItems: ListItemProps[] = [
  {
    header: 'For a More Creative Brain Follow These 5 Steps',
    detail:
      'Nearly all great ideas follow a similar creative process and this article explains how this process works. Understanding this is important because creative thinking is one of the most useful skills you can possess.',
    image: 'https://source.unsplash.com/GkinCd2enIY/400X400',
    id: 10011,
  },
  {
    header: 'The Proven Path to Doing Unique and Meaningful Work',
    detail:
      'In June of 2004, Arno Rafael Minkkinen stepped up to the microphone at the New England School of Photography to deliver the commencement speech.',
    image: 'https://source.unsplash.com/HIuiU7lqxj0/400X400',
    id: 10012,
  },
  {
    header: 'Creativity Is a Process, Not an Event',
    detail:
      'In 1666, one of the most influential scientists in history was strolling through a garden when he was struck with a flash of creative brilliance that would change the world.',
    image: 'https://source.unsplash.com/qFFS4I4hdIE/400X400',
    id: 10013,
  },
  {
    header: 'The Ultimate Productivity Hack is Saying No',
    detail:
      'Not doing something will always be faster than doing it. This statement reminds me of the old computer programming saying, “Remember that there is no code faster than no code.”',
    image: 'https://source.unsplash.com/QzKIuAy0nw8/400X400',
    id: 10014,
  },
  {
    header: 'How Experts Figure What to Focus On',
    detail:
      'Peak performance experts say things like, “You should focus. You need to eliminate the distractions. Commit to one thing and become great at that thing.”',

    image: 'https://source.unsplash.com/CIXXIWxxec4/400X400',
    id: 10015,
  },
  {
    header: '30 One-Sentence Stories From People Who Have Built Better Habits',
    detail:
      'None of these stories are mine. They were sent to me by readers of Atomic Habits. My hope is that these examples will illustrate how real people are putting the book into practice. They will show you what people are actually doing to build good habits and break bad ones. And hopefully, they will spark some ideas for how you can do the same.',
    image: 'https://source.unsplash.com/v3AW7szuD20/400X400',
    id: 10016,
  },
  {
    header: 'When the 80/20 Rule Fails: The Downside of Being Effective',
    detail:
      'Rising to fame in the 1950s, she was one of the greatest actresses of her era. In 1953, Hepburn became the first actress to win an Academy Award, a Golden Globe Award, and a BAFTA Award for a single performance: her leading role in the romantic comedy Roman Holiday.',
    image: 'https://source.unsplash.com/JQ7yAefHV14/400X400',
    id: 10017,
  },
  {
    header: '7 Ways to Retain More of Every Book You Read',
    detail:
      'There are many benefits to reading more books, but perhaps my favorite is this: A good book can give you a new way to interpret your past experiences.',
    image: 'https://source.unsplash.com/GkinCd2enIY/400X400',
    id: 10018,
  },
];

export const Colors = {
  leftMenu: '#005f73',
  indicator: '#005f73',
  indicatorContainerBackgroundColor: '#FFF',
  indicatorBackgroundInactive: '#005f73',
  indicatorBackgroundActive: '#e9d8a6',
  leftMenuText: '#e9d8a6',
  itemHeader: '#001219',
  itemDescription: '#4e575c',
  headerBackground: '#FFF',
  headerTextColor: '#001219',
  headerBorderColor: '#a2a7aa',
};
