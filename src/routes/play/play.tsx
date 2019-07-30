// tslint:disable-next-line: import-name
import React from 'react';
import { AppStore, mapStateToProps } from '../../store';
import { updateTitle } from '../../store/title.store';
import { connect } from 'react-redux';
import { WithStyles, Theme, createStyles, withStyles } from '@material-ui/core';
import { default as InstallationDialog } from '../../components/dialogs/installation/installation';
import { IResponseError, IResponseData, OpCode, IGadgetInfo, IResponseGameFrame, IRPCPayloadRaw } from '../../types/dmm';
import { SettingService } from '../../services/setting.service';
import { DMMService } from '../../services/dmm.service';
import { Redirect } from 'react-router';
import { default as UpdateSTDialog } from '../../components/dialogs/update-st/update-st';

const styles = (theme: Theme) => createStyles({
  pure: {
    position: 'fixed',
    left: 0,
    top: 0,
    margin: 0,
  },
  frame: {
    border: 0,
    display: 'block',
    margin: '24px auto',
  },
  kancolle: {
    top: '-16px',
  },
});

interface PlayProps extends WithStyles<typeof styles> {}

interface PlayState {
  category: 'general' | 'adult';
  name: string;
  navigate: string;
  iframeWidth: number;
  iframeHeight: number;
  rpcToken: string;
  gadgetInfo: IGadgetInfo;
  pure: boolean;
  loading: boolean;
  frameOrigin: string;
  osapi: string;
  updateStTimer: number;

  // redirects
  back: boolean;
  tokenExpired: boolean;

  // Dialog opener
  install: boolean;
  updateST: boolean;
  regist: boolean;
  payment: boolean;
}

class Play extends React.Component<AppStore & PlayProps, PlayState> {
  componentWillMount = () => {
    const title = '运行游戏';
    this.props.updateTitle(title);
    document.title = `${ title } | 躲猫猫`;
  }

  constructor(props: any) {
    super(props);
    const search = new URLSearchParams(window.location.search);
    this.state = {
      iframeWidth: 1200,
      iframeHeight: 1200,
      category: search.get('category') as 'general' | 'adult' || 'general',
      navigate: '',
      name: search.get('name') as string,
      rpcToken: '',
      gadgetInfo: {} as IGadgetInfo,
      pure: false,
      loading: false,
      frameOrigin: '',
      osapi: '',
      updateStTimer: 0,

      // redirects
      back: false,
      tokenExpired: false,

      // Dialog opener
      install: false,
      updateST: false,
      regist: false,
      payment: false,
    };
    this.run();
  }

  handleOsapi = (osapi: string) => {
    const parser = document.createElement('textarea');
    parser.innerHTML = osapi;
    const params = new URL(parser.value);
    if (params.searchParams.has('parent')) {
      params.searchParams.set('parent', `${window.location.origin}${window.location.pathname}`);
    }
    const hashPair: string[] = params.hash.substr(1).split('=');
    if (hashPair[0] === 'rpctoken') {
      this.setState({
        ...this.state,
        rpcToken: hashPair[1],
      });
    }
    const result = params.toString();
    return result;
  }

  public get frame() {
    const frame: HTMLIFrameElement = window.document.getElementById('game_frame') as HTMLIFrameElement;
    return frame;
  }

  public rpcMessage<T extends any[]>(event: string, ...data: T) {
    this.frame.contentWindow!.postMessage(
      JSON.stringify({
        s: event,
        a: data,
        t: this.state.rpcToken,
        c: 0,
        f: '..',
        l: false,
      } as IRPCPayloadRaw<T>),
      this.state.frameOrigin,
    );
  }

  public updateST = async () => {
    const result = await DMMService.updateST({
      app_name: this.state.name,
      app_id: this.state.gadgetInfo.app_id,
      app_base: this.state.category,
      st: encodeURIComponent(this.state.gadgetInfo.st),
      time: this.state.gadgetInfo.time,
      token: this.state.gadgetInfo.token,
    });
    if (result.code !== OpCode.OK || result.data.status !== 'ok') {
      clearInterval(this.state.updateStTimer);
      this.setState({
        ...this.state,
        updateST: true,
      });
      return;
    }
    if (this.state.gadgetInfo.st !== result.data.result) {
      this.state.gadgetInfo.st = result.data.result;
    }
    this.state.gadgetInfo.time = result.data.time;
    this.rpcMessage('update_security_token', this.state.gadgetInfo.st);
  }

  runGame = (response: IResponseData<IResponseGameFrame>) => {
    const gadgetInfo = (response).data.gadget_info;
    gadgetInfo.st = decodeURIComponent(gadgetInfo.st);
    if (SettingService.autoRedirect) {
      SettingService.game = undefined;
      SettingService.gameCategory = undefined;
      window.location.href = this.state.osapi;
      return;
    }
    SettingService.game = this.state.name;
    SettingService.gameCategory = this.state.category;
    clearInterval(this.state.updateStTimer);
    const updateStTimer = setInterval(this.updateST, 60 * 30 * 1000) as unknown as number;
    const osapi = this.handleOsapi(gadgetInfo.url);
    this.setState({
      ...this.state,
      gadgetInfo,
      updateStTimer,
      osapi,
      frameOrigin: new URL(osapi).origin,
    });
    // dirty fix for POI
    if ('align' in window) {
      this.setState({
        ...this.state,
        pure: true,
      });
    }
    if ('iframe_width' in response.data && response.data.iframe_width) {
      this.setState({
        ...this.state,
        loading: true,
        iframeWidth: response.data.iframe_width,
      });
    }
  }

  handleResponse = (response?: IResponseData<any> | IResponseError) => {
    if (!response) {
      return;
    }
    switch (response.code) {
      case OpCode.OK:
        this.runGame(response);
        break;
      case OpCode.DMM_GAME_INSTALL_NEEDED:
        this.setState({
          ...this.state,
          install: true,
        });
        break;
      case OpCode.DMM_REQUIRE_PROFILE:
        this.setState({
          ...this.state,
          regist: true,
        });
        break;
      case OpCode.DMM_FORCE_REDIRECT:
      case OpCode.DMM_GAME_ALREADY_INSTALLED:
        this.run();
        break;
      case OpCode.DMM_TOKEN_EXPIRED:
        SettingService.authenticated = false;
        this.setState({
          ...this.state,
          tokenExpired: true,
        });
        break;
      default:
        this.setState({
          ...this.state,
          back: true,
        });
    }
  }

  run() {
    const payload = {
      app_name: this.state.name,
      app_base: this.state.category,
    };
    DMMService.run(payload).then(response => this.handleResponse(response));
  }

  render() {
    const { classes } = this.props;
    return <div>
      { this.state.back && <Redirect to="/game-list"></Redirect> }
      { this.state.tokenExpired && <Redirect to="/auth"></Redirect> }
      <div
        className={ `game-container ${this.state.loading ? 'loading' : ''}` }
      >
        { this.state.osapi && (
          <iframe
            id="game_frame"
            className={
              `game_frame ${classes.frame} ${
                this.state.pure ? `${classes.pure} ${
                  this.state.name in classes ? classes[this.state.name as keyof typeof classes] : ''
                } : ''` : ''
              }`
            }
            src={ this.state.osapi }
            width={ this.state.iframeWidth }
            height={ this.state.iframeHeight }
            scrolling="no"
            allowFullScreen={ true }
          ></iframe>)
        }
      </div>
      <InstallationDialog
        payload={{
          app_name: this.state.name,
          app_base: this.state.category,
        }}
        open={ this.state.install }
        onClose={ (response) => {
          if (!response) {
            this.setState({
              ...this.state,
              back: true,
            });
          }
          this.handleResponse(response);
        } }
      ></InstallationDialog>
      <UpdateSTDialog
        open={ this.state.updateST }
        onClose={ (result) => {
          this.setState({
            ...this.state,
            updateST: false,
          });
          if (result) {
            this.run();
          }
        } }
      ></UpdateSTDialog>
    </div>;
  }
}

export default connect(
  mapStateToProps,
  { updateTitle },
)(withStyles(styles)(Play));
