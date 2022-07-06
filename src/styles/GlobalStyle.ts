import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import BMHANNAAir from "./fonts/BMHANNAAir.woff";
import SpoqaHanSansNeoBold from "./fonts/SpoqaHanSansNeo-Bold.woff";
import SpoqaHanSansNeoRegular from "./fonts/SpoqaHanSansNeo-Regular.woff";

const GlobalStyle = createGlobalStyle`
@font-face{
    font-family: BMHANNAAir;
    src: url(${BMHANNAAir}) format('woff');;
}
@font-face{
    font-family: SpoqaHanSansNeoBold;
    src: url(${SpoqaHanSansNeoBold}) format('woff');;
}
@font-face{
    font-family: SpoqaHanSansNeoRegular;
    src: url(${SpoqaHanSansNeoRegular}) format('woff');;
}
    ${reset}
    html, body{
        overflow: hidden;
        color: #626262;
        line-height: 1.2em;
        @media (min-width: 320px) and (max-width: 480px) {
            font-size: 14px;
        } 
    }
    *{        
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    button{
        all: unset;
        cursor: pointer;
        box-sizing: border-box;
        padding: 4px;
        background: ${(props) => props.theme.colors.button};
        &:active {
            background: ${(props) => props.theme.colors.buttonActive};
        }
    }
`;
export default GlobalStyle;
