import { default as React } from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core';

interface UpdateSTDialogProps {
  open: boolean;
  onClose: (result: boolean) => void;
}

class UpdateSTDialog extends React.Component<UpdateSTDialogProps> {
  render() {
    return <Dialog
      open={ this.props.open }
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">安全凭据已过期, 请刷新页面</DialogTitle>
      <DialogActions>
        <Button
          onClick={ () => {
            this.props.onClose(false);
          } }
          color="primary"
        >
          返回
        </Button>
        <Button
          onClick={ () => {
            this.props.onClose(true);
          } }
          color="primary"
        >
          确定
        </Button>
      </DialogActions>
    </Dialog>;
  }
}

export default UpdateSTDialog;
