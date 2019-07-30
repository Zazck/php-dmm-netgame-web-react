import { default as React } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, WithStyles, withStyles, CircularProgress, createStyles, Theme, Typography } from '@material-ui/core';
import { IResponseData, IResponseError, IResponsePaymentAction, IResponsePaymentDetail, IPaymentPayload } from '../../../types/dmm';
import { DMMService } from '../../../services/dmm.service';

import 'moment/locale/zh-cn';
import './payment.css';

const styles = (theme: Theme) => createStyles({
  progress: {
    color: theme.palette.grey[500],
  },
});

interface PaymentDialogProps extends WithStyles<typeof styles> {
  open: boolean;
  onClose: (response: IResponseData<IResponsePaymentAction> | IResponseError) => void;
  detail: IResponsePaymentDetail;
  payload: IPaymentPayload;
}

interface PaymentDialogState {
  processingPayment: boolean;
  processingCancel: boolean;
}

class PaymentDialog extends React.Component<PaymentDialogProps, PaymentDialogState> {
  constructor(props: any) {
    super(props);
    this.state = {
      processingPayment: false,
      processingCancel: false,
    };
  }

  commit = async () => {
    this.setState({ ...this.state, processingPayment: true });
    const result = await DMMService
      .paymentCommit(this.props.payload).catch(() => {
        this.setState({ ...this.state, processingPayment: false });
        return null;
      });
    if (result !== null) {
      this.props.onClose(result);
    }
  }

  cancel = async () => {
    this.setState({ ...this.state, processingCancel: true });
    const result = await DMMService
      .paymentCancel(this.props.payload).catch(() => {
        this.setState({ ...this.state, processingCancel: false });
        return null;
      });
    if (result !== null) {
      this.props.onClose(result);
    }
  }

  render() {
    const { classes, detail } = this.props;
    return <Dialog
      open={ this.props.open }
      onExited={ () => this.setState({
        ...this.state,
        processingCancel: false,
        processingPayment: false,
      }) }
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">完善用户资料</DialogTitle>
      <DialogContent>
        <div className="item-info">
          <img src={ detail.itemImage } alt={ detail.itemTitle } width="180" height="180" />
          <Typography component="h6" variant="h6">
            { detail.itemTitle }
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            { detail.itemDescription }
          </Typography>
        </div>
        <div className="payment-detail">
          <table>
            <tbody>
              <tr>
                <td>单价</td>
                <td>{ new Intl.NumberFormat('en-US').format(detail.itemPrice) }pt</td>
              </tr>
              <tr>
                <td>数量</td>
                <td>{ detail.itemCount }</td>
              </tr>
              <tr>
                <td>总价</td>
                <td>{ new Intl.NumberFormat('en-US').format(detail.itemPrice * detail.itemCount) }pt</td>
              </tr>
              <tr>
                <td>持有点数</td>
                <td>{ new Intl.NumberFormat('en-US').format(detail.point) }pt</td>
              </tr>
              <tr>
                <td>结算点数</td>
                <td>{ new Intl.NumberFormat('en-US').format(detail.point - detail.itemPrice * detail.itemCount) }pt</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={ this.cancel }
          color="primary"
          disabled={ this.state.processingPayment || this.state.processingCancel }
        >
          { this.state.processingCancel && <CircularProgress size="24px" className={ classes.progress } /> }
          { !this.state.processingCancel && '取消' }
        </Button>
        <Button
          onClick={ this.commit }
          color="primary"
          disabled={ this.state.processingPayment || this.state.processingCancel || detail.itemPrice * detail.itemCount > detail.point }
        >
          { this.state.processingPayment && <CircularProgress size="24px" className={ classes.progress } /> }
          { !this.state.processingPayment && (detail.itemPrice * detail.itemCount > detail.point) ?  '点数不足' : '确定' }
        </Button>
      </DialogActions>
    </Dialog>;
  }
}

export default withStyles(styles)(PaymentDialog);
