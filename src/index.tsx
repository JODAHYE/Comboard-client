import ReactDOM from "react-dom";
import App from "./App";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import { theme } from "./styles/theme";
import { Provider } from "react-redux";
import { store } from "./app/store";
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <GlobalStyle />
      <App />
    </Provider>
  </ThemeProvider>,
  document.getElementById("root")
);
