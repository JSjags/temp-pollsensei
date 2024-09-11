// Define the shape of the state object
export interface CustomState {
  isFocused: boolean;
  isSelected?: boolean;
}

// Define the type for style functions
export type StyleFunction<T> = (base: CSSObject, state: CustomState) => T;

// Define the structure of our custom styles
export interface CustomStyles {
  control: StyleFunction<CSSObject>;
  option: StyleFunction<CSSObject>;
  singleValue: StyleFunction<CSSObject>;
  multiValueRemove: StyleFunction<CSSObject>;
  multiValue: StyleFunction<CSSObject>;
  menu: StyleFunction<CSSObject>;
  menuList: StyleFunction<CSSObject>;
  menuPortal: StyleFunction<CSSObject>;
  container: StyleFunction<CSSObject>;
  placeholder: StyleFunction<CSSObject>;
}
