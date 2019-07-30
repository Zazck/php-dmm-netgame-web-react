import { default as React } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, WithStyles, withStyles, CircularProgress, createStyles, Theme, FormGroup, Checkbox, FormControlLabel } from '@material-ui/core';
import { IInstallPayload, IResponseData, IResponseGameFrame, IResponseError, OpCode, IRunPayload } from '../../../types/dmm';
import { DMMService } from '../../../services/dmm.service';

const styles = (theme: Theme) => createStyles({
  progress: {
    color: theme.palette.grey[500],
  },
});

interface InstallationDialogProps extends WithStyles<typeof styles> {
  open: boolean;
  onClose: (response?: IResponseData<IResponseGameFrame> | IResponseError) => void;
  payload: IRunPayload;
}

interface InstallationDialogState {
  requesting: boolean;
  notification: boolean;
  myapp: boolean;
}

class InstallationDialog extends React.Component<InstallationDialogProps, InstallationDialogState> {
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
      app_name: this.props.payload.app_name,
      app_base: this.props.payload.app_base,
      notification: this.state.notification ? 1 : 0,
      myapp: this.state.myapp ? 1 : 0,
    };
    const response = await DMMService.install(payload);
    this.setState({ ...this.state, requesting: false });
    if (response.code === OpCode.OK || response.code === OpCode.DMM_GAME_ALREADY_INSTALLED) {
      this.props.onClose(response);
    }
  }

  handleCheckboxChange = (event: React.ChangeEvent, key: 'notification' | 'myapp') => {
    this.setState({
      ...this.state,
      [key]: JSON.parse((event.target as any).checked),
    });
  }

  render() {
    const { classes } = this.props;
    return <Dialog
      open={ this.props.open }
      onExited={ () => this.setState({
        ...this.state,
        requesting: false,
      }) }
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">安装游戏到账户</DialogTitle>
      <DialogContent>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                onChange={e => this.handleCheckboxChange(e, 'notification')}
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
                onChange={e => this.handleCheckboxChange(e, 'myapp')}
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
          onClick={ () => {
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

export default withStyles(styles)(InstallationDialog);
