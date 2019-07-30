import { default as React } from 'react';
import { SettingService } from '../../services/setting.service';
import { AppStore, mapStateToProps } from '../../store';
import { updateTitle } from '../../store/title.store';
import { connect } from 'react-redux';
import { Toolbar, Tabs, Tab, createStyles, Theme, withStyles, WithStyles, Paper, TextField, FormControlLabel, Checkbox, FormGroup, Button, CircularProgress } from '@material-ui/core';
import { LocalFlorist, LocalBar } from '@material-ui/icons';
import { DMMService } from '../../services/dmm.service';
import { OpCode } from '../../types/dmm';
import { Redirect } from 'react-router-dom';

const styles = (theme: Theme) => createStyles({
  container: {
    width: '320px',
    margin: '48px auto 0 auto',
  },
  inputBox: {
    padding: '24px',
    margin: '24px 0',
  },
  field: {
    marginTop: '16px',
  },
  tabs: {
    width: '100%',
  },
  actionButton: {
    height: '48px',
    fontSize: '1rem',
    width: '100%',
  },
  progress: {
    color: theme.palette.grey[500],
  },
});

interface AuthProps extends WithStyles<typeof styles> {}

interface ILoginPayload {
  loginID: string;
  password: string;
  saveLoginID: boolean;
  savePassword: boolean;
  autoLogin: boolean;
}

interface AuthState {
  category: 0 | 1;
  requesting: boolean;
  loginPayload: ILoginPayload;
  done: boolean;
}

class Auth extends React.Component<AppStore & AuthProps, AuthState> {
  componentWillMount = () => {
    const title = '登录';
    this.props.updateTitle(title);
    document.title = `${ title } | 躲猫猫`;
  }
  constructor(props: any) {
    super(props);
    this.state = {
      category: SettingService.category === 'exchange' ? 1 : 0,
      requesting: false,
      loginPayload: {
        loginID: SettingService.loginID || '',
        password: SettingService.password || '',
        saveLoginID: SettingService.loginID ? true : false,
        savePassword: SettingService.password ? true : false,
        autoLogin: SettingService.autoLogin ? true : false,
      },
      done: false,
    };
  }
  handleCategoryChange = (_: any, value: 0 | 1) => {
    this.setState({ ...this.state, category: value });
  }
  handleLoginPayloadChange = (event: React.ChangeEvent, key: keyof ILoginPayload) => {
    this.setState({ ...this.state, loginPayload: {
      ...this.state.loginPayload,
      [key]: (event.target as any).value,
    }});
  }
  handleCheckboxChange = (event: React.ChangeEvent, key: keyof ILoginPayload) => {
    this.setState({ ...this.state, loginPayload: {
      ...this.state.loginPayload,
      [key]: JSON.parse((event.target as any).checked),
    }});
  }
  public login = async () => {
    this.setState({ ...this.state, requesting: true });
    const result = await DMMService.login(
      {
        login_id: this.state.loginPayload.loginID,
        password: this.state.loginPayload.password,
        use_auto_login: this.state.loginPayload.autoLogin ? 1 : 0,
        save_login_id: this.state.loginPayload.saveLoginID ? 1 : 0,
        save_password: this.state.loginPayload.savePassword ? 1 : 0,
      },
      this.state.category === 1,
    );
    if (result.code === OpCode.OK) {
      this.setState({ ...this.state, done: true });
      return;
    }
    this.setState({ ...this.state, requesting: false });
  }
  public logout = async () => {
    this.setState({ ...this.state, requesting: true });
    await DMMService.logout();
    this.setState({ ...this.state, requesting: false });
  }
  render() {
    const { classes } = this.props;
    const { requesting } = this.state;
    const { authenticated } = SettingService;
    return <div className={ classes.container }>
      { this.state.done && <Redirect to="/game-list" push={true} /> }
      { !authenticated ? (
      <div>
        <Toolbar disableGutters={ true }>
          <Tabs
            className={ classes.tabs }
            value={ this.state.category }
            variant="fullWidth"
            onChange={ this.handleCategoryChange }
            aria-label="选择分区"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="全年龄" icon={<LocalFlorist />} />
            <Tab label="成人向" icon={<LocalBar />} />
          </Tabs>
        </Toolbar>
        <Paper className={ classes.inputBox }>
          <form>
            <TextField
              label="DMM 用户邮箱"
              margin="normal"
              name="login_id"
              autoComplete="username"
              fullWidth
              value={ this.state.loginPayload.loginID }
              onChange={e => this.handleLoginPayloadChange(e, 'loginID')}
            />
            <TextField
              label="DMM 用户密码"
              type="password"
              margin="normal"
              name="password"
              autoComplete="current-password"
              fullWidth
              value={ this.state.loginPayload.password }
              onChange={e => this.handleLoginPayloadChange(e, 'password')}
            />
            <FormGroup className={ classes.field }>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={e => this.handleCheckboxChange(e, 'saveLoginID')}
                    checked={ this.state.loginPayload.saveLoginID }
                    color="primary"
                  />
                }
                label="记住账号"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={e => this.handleCheckboxChange(e, 'savePassword')}
                    checked={ this.state.loginPayload.savePassword }
                    color="primary"
                  />
                }
                label="记住密码"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={e => this.handleCheckboxChange(e, 'autoLogin')}
                    checked={ this.state.loginPayload.autoLogin }
                    color="primary"
                  />
                }
                label="自动登录"
              />
            </FormGroup>
          </form>
        </Paper>
        <div className={ classes.field }>
          <Button
            variant="contained"
            color="primary"
            className={ classes.actionButton }
            onClick={ this.login }
            disabled={ this.state.requesting }
          >
            { requesting && <CircularProgress size="24px" className={ classes.progress } /> }
            { !requesting && '登录' }
          </Button>
        </div>
      </div>
      ) : (
      <div>
        <Button
          variant="contained"
          color="primary"
          className={ classes.actionButton }
          onClick={ this.logout }
          disabled={ this.state.requesting }
        >
          { requesting && <CircularProgress size="24px" className={ classes.progress } /> }
          { !requesting && '切换账号' }
        </Button>
      </div>
      )}
    </div>;
  }
}

export default connect(
  mapStateToProps,
  { updateTitle },
)(withStyles(styles)(Auth));
