import { default as React } from 'react';
import {
  BrowserRouter as Router,
  Route,
  NavLink,
} from 'react-router-dom';
import {
  IconButton,
  Typography,
  AppBar,
  Toolbar,
  withStyles,
  Theme,
  WithStyles,
  createStyles,
  SvgIcon,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
} from '@material-ui/core';
import {
  Menu,
  ExitToApp as ExitToAppIcon,
  List as ListIcon,
  PlayArrow as PlayArrowIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  ArrowDropDown,
} from '@material-ui/icons';
import { updateTitle } from './store/title.store';
import { updateGeneralGameList } from './store/game-list.store';

import './App.css';
import { default as AuthGuardRoute } from './guards/auth.guard';
import { default as PlayGuardRoute } from './guards/play.guard';
import { default as Play } from './routes/play/play';
import { default as GameList } from './routes/game-list/game-list';
import { default as Auth } from './routes/auth/auth';
import { default as Settings } from './routes/settings/settings';
import { default as About } from './routes/about/about';
import { mapStateToProps, AppStore } from './store';
import { connect } from 'react-redux';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { DMMService } from './services/dmm.service';

const styles = (theme: Theme) => createStyles({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    whiteSpace: 'nowrap',
  },
  drawerTitle: {
    display: 'flex',
    minHeight: 64,
    paddingLeft: 24,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  active: {
    color: `${theme.palette.primary.main} !important`,
    background: `${theme.palette.primary.main}20 !important`,
    pointerEvents: 'none',
  },
  link: {
    textDecoration: 'none',
    display: 'block',
    color: theme.palette.grey[900],
  },
  drawer: {
    width: '256px',
  },
  background: {
    backgroundColor: theme.palette.grey[50],
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
});

interface AppProps extends WithStyles<typeof styles> {}

interface AppState {
  opened: boolean;
  snackbar: boolean;
  snackbarMessage: string;
}

interface INavLink {
  icon: React.ComponentType<SvgIconProps>;
  title: string;
  to: string;
  exact?: boolean;
}

export class App extends React.Component<AppStore & AppProps, AppState> {
  navLinks: INavLink[] = [
    {
      icon: ExitToAppIcon,
      title: '登录',
      to: '/auth',
    },
    {
      icon: ListIcon,
      title: '游戏列表',
      to: '/game-list',
    },
    {
      icon: PlayArrowIcon,
      title: '运行游戏',
      exact: true,
      to: '/',
    },
    {
      icon: SettingsIcon,
      title: '设置',
      to: '/settings',
    },
    {
      icon: InfoIcon,
      title: '关于',
      to: '/about',
    },
  ];
  constructor(props: any) {
    super(props);
    this.state = {
      opened: false,
      snackbar: false,
      snackbarMessage: '',
    };
  }
  toggleDrawer = (opened: boolean) => {
    this.setState({ opened });
  }
  closeSnackbar = () => { this.setState({ ...this.state, snackbar: false }); };
  componentDidMount = () => {
    DMMService.emiter.on('message', (message: string) => {
      this.setState({
        ...this.state,
        snackbar: true,
        snackbarMessage: message,
      });
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={ `App ${classes.background}` }>
        <Router>
          <Drawer
            open={ this.state.opened }
            onClose={ () => this.toggleDrawer(false) }
          >
            <div className={ classes.drawerTitle }>
              <Typography
                variant="h6"
                color="inherit"
              >
                站点导航
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
              >
                DMM网页游戏登录器
              </Typography>
            </div>
            <List className={ classes.drawer }>
              {this.navLinks.map(link => (
                <NavLink
                  to={ link.to }
                  activeClassName={ `route-active ${classes.active}` }
                  exact={ link.exact }
                  className={ classes.link }
                  onClick={ () => {
                    this.setState({ ...this.state, opened: false });
                    return true;
                  } }
                  key={link.title}
                >
                  <ListItem
                    button
                  >
                      <ListItemIcon><link.icon color="inherit"></link.icon></ListItemIcon>
                      <ListItemText primary={link.title} />
                  </ListItem>
                </NavLink>
              ))}
            </List>
          </Drawer>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="打开导航栏"
                className={ classes.menuButton }
                onClick={ () => this.toggleDrawer(true) }
              >
                <Menu />
              </IconButton>
              <Typography variant="h6" color="inherit" className={ classes.title }>
                { this.props.titleState.title }
              </Typography>
              <IconButton
                aria-label="Github Repository"
                color="inherit"
                href="https://github.com/zazck/php-dmm-netgame"
                target="_blank"
              >
                <SvgIcon height="24" viewBox="0 0 16 16" version="1.1" width="24" aria-hidden="true"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></SvgIcon>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Route path="/auth" component={ Auth } />
          <Route path="/settings" component={ Settings } />
          <Route path="/about" component={ About } />
          <Route path="/game-list" render={ () => <AuthGuardRoute component={ GameList } /> } />
          <Route path="/play" render={ () => <PlayGuardRoute component={ Play }></PlayGuardRoute> } />
          <Route path="/" exact render={ () => <PlayGuardRoute component={ Play }></PlayGuardRoute> } />
          <Snackbar
            key={ new Date().toString() }
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={this.state.snackbar}
            autoHideDuration={ 5000 }
            onClose={ this.closeSnackbar }
            // onExited={this.handleExited}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{ this.state.snackbarMessage }</span>}
            action={
              <IconButton
                key="close"
                aria-label="close"
                color="inherit"
                // className={classes.close}
                onClick={ this.closeSnackbar }
              >
                <ArrowDropDown />
              </IconButton>
            }
          />
        </Router>
      </div>
    );
  }
}

export default connect<any, any, any, any>(
  mapStateToProps,
  { updateTitle, updateGeneralGameList },
)(withStyles(styles)(App));
