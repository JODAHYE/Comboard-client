import "styled-components";
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      main: string;
      button: string;
      fontColor: string;
      buttonActive: string;
      shadow: string;
    };
    displayFlex: {
      display: string;
      justifyContent: string;
      alignItems: string;
    };
    logo: {
      width: string;
      height: string;
      boxShadow: string;
      borderRadius: string;
      cursor: string;
    };
    iconColor: {
      filter: string;
    };
    iconColorWhite: {
      filter: string;
    };
  }
}

declare module "dompurify" {
  export default any;
}
