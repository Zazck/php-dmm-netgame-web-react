// tslint:disable-next-line: import-name
import React from 'react';
import { connect } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, WithStyles, withStyles, CircularProgress, createStyles, Theme, FormGroup, Checkbox, FormControlLabel } from '@material-ui/core';
import { Redirect } from 'react-router';
import { IInstallPayload, IResponseData, IResponseGameFrame, IResponseError, OpCode } from '../../../types/dmm';
import { DMMService } from '../../../services/dmm.service';

const styles = (theme: Theme) => createStyles({
  progress: {
    color: theme.palette.grey[500],
  },
});

interface RegistrationDialogProps extends WithStyles<typeof styles> {
  open: boolean;
  onClose: (response?: IResponseData<IResponseGameFrame> | IResponseError) => void;
  appName: string;
  appBase: string;
}

interface RegistrationDialogState {
  requesting: boolean;
  notification: boolean;
  myapp: boolean;
}

class RegistrationDialog extends React.Component<RegistrationDialogProps, RegistrationDialogState> {
  constructor(props: any) {
    super(props);
    this.state = {
      requesting: false,
      notification: true,
      myapp: true,
    };
  }
  install = async () => {
    this.setState({ ...this.state, requesting: true });
    const payload: IInstallPayload = {
      app_name: this.props.appName,
      app_base: this.props.appBase,
      notification: this.state.notification ? 1 : 0,
      myapp: this.state.myapp ? 1 : 0,
    };
    const response = await DMMService.install(payload);
    this.setState({ ...this.state, requesting: false });
    if (response.code === OpCode.OK) {
      this.props.onClose(response);
    }
  }

  handleLoginPayloadCheckboxChange = (event: React.ChangeEvent, key: 'notification' | 'myapp') => {
    this.setState({
      ...this.state,
      [key]: JSON.parse((event.target as any).checked),
    });
  }

  render() {
    const { classes } = this.props;
    return <Dialog
      open={ this.props.open }
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">安装游戏到账户</DialogTitle>
      <DialogContent>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                onChange={e => this.handleLoginPayloadCheckboxChange(e, 'notification')}
                checked={ this.state.notification }
                color="primary"
                name="notification"
              />
            }
            label="接收消息提醒"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={e => this.handleLoginPayloadCheckboxChange(e, 'myapp')}
                checked={ this.state.myapp }
                color="primary"
                name="myapp"
              />
            }
            label="在个人资料里显示这个应用"
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={ (...args) => {
            this.props.onClose();
          } }
          color="primary"
        >
          返回
        </Button>
        <Button
          onClick={ this.install } color="primary">
          { this.state.requesting && <CircularProgress size="24px" className={ classes.progress } /> }
          { !this.state.requesting && '安装' }
        </Button>
      </DialogActions>
    </Dialog>;
  }
}

export default withStyles(styles)(RegistrationDialog);
