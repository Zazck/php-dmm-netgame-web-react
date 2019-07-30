import { default as React } from 'react';
import { default as ReactDOM } from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { default as configureStore } from './store';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { deepPurple, teal } from '@material-ui/core/colors';

const store = configureStore();

const theme = createMuiTheme({
  palette: {
    primary: { main: deepPurple.A700 }, // Purple and green play nicely together.
    secondary: { main: teal[600] }, // This is just green.A700 as hex.
  },
});

class Root extends React.Component<any, any> {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={ store }>
          <App />
        </Provider>
      </MuiThemeProvider>
    );
  }
}
ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
