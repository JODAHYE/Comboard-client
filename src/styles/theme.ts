import { DefaultTheme } from "styled-components";

const theme: DefaultTheme = {
  colors: {
    main: "#A8BBF4",
    button: "#5F81E4",
    buttonActive: "#A8BBF4",
    fontColor: "#5E5E5E",
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
      "invert(64%) sepia(55%) saturate(2269%) hue-rotate(2deg) brightness(109%) contrast(104%)",
  },
  iconColorWhite: {
    filter: "brightness(0) invert(1)",
  },
};
export { theme };
