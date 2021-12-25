export type HeaderProps = {
  headerIndex: number;
};

export type Measure = {
  x: number;
  y: number;
  height: number;
  width: number;
};

export type LeftMenuIndicatorProps = {
  measuresData: Measure[];
  tabScrollX: any;
};

export type LeftMenuItemProps = {
  item: any;
  setTabScrollX(index: number): void;
  index: number;
};

export type ListItemProps = {
  header: string;
  detail: string;
  image: string;
  id: number;
};

export type LeftMenuContainerProps = {
  setTabScrollX(x: number): void;
};

export type ListTabContainerProps = {
  tabScrollX: any;
};
