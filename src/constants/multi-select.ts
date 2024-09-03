import { CustomStyles } from "../../types";

export const multiSelectCustomStyles: CustomStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "transparent",
    borderColor: state.isFocused ? "#ffffff" : "hsla(214.3 31.8% 91.4%)",
    height: "48px",
    zIndex: 100000,
    boxShadow: state.isFocused ? "0 0 0 2px #6b21a8" : null,
    "&:hover": {
      borderColor: state.isFocused ? "#ffffff" : "#dfdfdf",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#007bff"
      : state.isFocused
      ? "#f8f9fa"
      : null,
    color: state.isSelected ? "white" : "black",
    cursor: "pointer",
    zIndex: 100000,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#495057",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "4px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)",
    marginTop: "4px",
    zIndex: 100000,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: "5px",
    zIndex: 100000,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 100000,
  }),
  container: (provided) => ({
    ...provided,
    zIndex: 100000,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#02081740",
    "padding-left": "10px",
    // fontSize: '14px',
    // fontStyle: "italic",
  }),
};
