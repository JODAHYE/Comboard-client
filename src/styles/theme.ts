import { DefaultTheme } from "styled-components";

const theme: DefaultTheme = {
  colors: {
    main: "#6AB350",
    button: "#74D378",
    buttonActive: "#86EBAD",
    fontColor: "rgb(104, 103, 103)",
    shadow: "#E7E7E7",
  },
  displayFlex: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "40px",
    height: "40px",
    boxShadow: "2px 2px 2px 2px rgb(211, 210, 210)",
    borderRadius: "4px",
    cursor: "pointer",
  },
  iconColor: {
    filter:
      "invert(91%) sepia(50%) saturate(403%) hue-rotate(10deg) brightness(100%) contrast(94%);",
  },
};
export { theme };
