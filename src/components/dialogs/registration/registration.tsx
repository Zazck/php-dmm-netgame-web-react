import { default as React } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button, WithStyles,
  withStyles,
  CircularProgress,
  createStyles,
  Theme,
  FormGroup,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  RadioGroup,
  Radio,
} from '@material-ui/core';
import { IResponseData, IResponseError, OpCode, IRegistPayload } from '../../../types/dmm';
import { DMMService } from '../../../services/dmm.service';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import { default as MomentUtils } from '@date-io/moment';
import { default as Moment } from 'moment';
import 'moment/locale/zh-cn';
import { Autorenew, InsertInvitation } from '@material-ui/icons';

const styles = (theme: Theme) => createStyles({
  progress: {
    color: theme.palette.grey[500],
  },
  gender: {
    flexDirection: 'row',
  },
});

interface RegistrationDialogProps extends WithStyles<typeof styles> {
  open: boolean;
  onClose: (response?: IResponseData<null> | IResponseError) => void;
  appBase: string;
}

interface RegistrationDialogState {
  requesting: boolean;
  nickname: string;
  gender: 'male' | 'female';
  isGeneralChecked: boolean;
  isAdultChecked: boolean;
  minDate: Date;
  maxDate: Date;
  birthday: Moment.Moment;
}

class RegistrationDialog extends React.Component<RegistrationDialogProps, RegistrationDialogState> {
  public readonly nickNameList = [
    '提督', '審神者', '親方', '社長', '王子', '城主', 'プロデューサー', '首領', '店長', '千雪',
    '結城', '山田', '田中', '紅雪', '小春凪', 'なつひめ', 'みさか白鳳', 'てまり姫', '早生あかつき',
    'ゆかりん', 'かおりん', 'あーみん', 'まりあ', 'ことり', 'ゆっきー', 'みいにゃん', 'あやきち', 'つぐつぐ', 'みゆ',
    '十六夜', '琥珀', '月輝夜姫', '都椿姫', '百日紅', '花螺李', '濡烏', '王鈴', '秋茜', '姫星紅',
    '龍眼', '黒の剣士', '自宅警備員', '星の王子様', 'マルク', 'カメバズーカ', 'アルパカ', 'ペンギン', 'ロキ', 'ムスカ',
    'シルキー', '月の住人', 'ホワイトライオン', '覇王', '仙人掌', 'しらゆき', 'なぎ', 'はづき', 'ハラショー', 'ハーゲンティ',
    'ムルムル', '黒い天使', 'レリエル', 'ルベライト', '赤虎眼石', 'きたかみ', 'さしゃ', 'ななみつき', 'はやて', '北斗',
    'クレド', 'カノン', 'ねむのき',
  ];

  randomNickname = () => {
    return this.nickNameList[Math.floor(Math.random() * this.nickNameList.length)];
  }

  constructor(props: any) {
    super(props);
    this.state = {
      requesting: false,
      nickname: this.randomNickname(),
      gender: 'male',
      isGeneralChecked: true,
      isAdultChecked: false,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(new Date().getFullYear() - 18, 11, 31),
      birthday: Moment(new Date(new Date().getFullYear() - 18, 0, 1)),
    };
  }

  regist = async () => {
    this.setState({ ...this.state, requesting: true });
    const payload: IRegistPayload = {
      app_base: this.props.appBase,
      nickname: this.state.nickname,
      gender: this.state.gender,
      year: this.state.birthday.year().toString(),
      month: (this.state.birthday.month() + 1).toString().padStart(2, '0'),
      day: this.state.birthday.date().toString().padStart(2, '0'),
    };
    if (this.state.isGeneralChecked) {
      payload.isGeneralChecked = 'on';
    }
    if (this.state.isAdultChecked) {
      payload.isAdultChecked = 'on';
    }
    const response = await DMMService.regist(payload);
    this.setState({ ...this.state, requesting: false });
    if (response.code === OpCode.OK) {
      this.props.onClose(response);
    }
  }

  handleCheckboxChange = (event: React.ChangeEvent, key: 'isGeneralChecked' | 'isAdultChecked') => {
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
      <DialogTitle id="form-dialog-title">完善用户资料</DialogTitle>
      <DialogContent>
        <FormGroup>
          <FormControl margin="normal">
            <InputLabel htmlFor="random-username">昵称</InputLabel>
            <Input
              id="random-username"
              type="text"
              value={ this.state.nickname }
              onChange={ event => this.setState({
                ...this.state,
                nickname: event.target.value,
              }) }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="随机"
                    onClick={() => {
                      this.setState({
                        ...this.state,
                        nickname: this.randomNickname(),
                      });
                    }}
                    onMouseDown={ event => event.preventDefault() }
                  >
                    <Autorenew />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl component="fieldset" margin="normal">
            <RadioGroup
              aria-label="性别"
              name="gender"
              className={classes.gender}
              value={ this.state.gender }
              onChange={ (_, value) => this.setState({
                ...this.state,
                gender: value as 'male' | 'female',
              }) }
            >
              <FormControlLabel value="male" control={<Radio />} label="男性" />
              <FormControlLabel value="female" control={<Radio />} label="女性" />
            </RadioGroup>
          </FormControl>
          <FormControl margin="normal">
            <MuiPickersUtilsProvider utils={MomentUtils} locale="zh-cn">
              <DatePicker
                value={ this.state.birthday }
                label="出生日期"
                okLabel="确定"
                cancelLabel="取消"
                onChange={ date => this.setState({
                  ...this.state,
                  birthday: date as Moment.Moment,
                }) }
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="选择出生日期"
                      // onClick={  }
                    >
                      <InsertInvitation />
                    </IconButton>
                  ),
                }}
              />
            </MuiPickersUtilsProvider>
          </FormControl>
          <FormControl margin="normal">
            <FormControlLabel
              control={
                <Checkbox
                  onChange={e => this.handleCheckboxChange(e, 'isGeneralChecked')}
                  checked={ this.state.isGeneralChecked }
                  name="isGeneralChecked"
                />
              }
              label="订阅DMM GAMES邮件杂志"
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={e => this.handleCheckboxChange(e, 'isAdultChecked')}
                  checked={ this.state.isAdultChecked }
                  name="isAdultChecked"
                />
              }
              label="订阅DMM GAMES成人向邮件杂志"
            />
          </FormControl>
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
          onClick={ this.regist } color="primary">
          { this.state.requesting && <CircularProgress size="24px" className={ classes.progress } /> }
          { !this.state.requesting && '确定' }
        </Button>
      </DialogActions>
    </Dialog>;
  }
}

export default withStyles(styles)(RegistrationDialog);
