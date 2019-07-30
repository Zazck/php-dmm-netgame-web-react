// tslint:disable-next-line: import-name
import React from 'react';
import { AppStore, mapStateToProps } from '../../store';
import { updateTitle } from '../../store/title.store';
import { connect } from 'react-redux';
import { SettingService } from '../../services/setting.service';
import { FormControlLabel, Switch, createStyles, WithStyles, withStyles, Button } from '@material-ui/core';

const styles = () => createStyles({
  settingsBody: {
    width: '320px',
    margin: '24px auto',
  },
});

interface SettingsSProps extends WithStyles<typeof styles> { }

interface SettingsState {
  autoRedirect: boolean;
}

class Settings extends React.Component<AppStore & SettingsSProps, SettingsState> {
  componentWillMount = () => {
    const title = '设置';
    this.props.updateTitle(title);
    document.title = `${ title } | 躲猫猫`;
  }
  render() {
    const { autoRedirect } = SettingService;
    const { classes } = this.props;
    return <div className={ classes.settingsBody }>
      <FormControlLabel
        control={
          <Switch
            checked={ autoRedirect }
            onChange={ (_, value) => {
              SettingService.autoRedirect = value;
              this.setState({
                ...this.state,
                autoRedirect: value,
              });
            } }
            inputProps={{ 'aria-label': '自动跳转到OSAPI框架页' }}
          />
        }
        label="自动跳转到OSAPI框架页"
      />
      <Button
        variant="contained"
        color="primary"
        // className={ classes.actionButton }
        onClick={ () => { SettingService.cookies = []; }}
      >清除Cookies</Button>
    </div>;
  }
}

export default connect(
  mapStateToProps,
  { updateTitle },
)(withStyles(styles)(Settings));
