import { EventEmitter } from 'events';
import { SettingService } from './setting.service';
import { OpCode, IResponseMessage, ILoginPayload, IResponseError, IResponseData, IRunPayload, IResponseGameFrame, IRequestPaymentPayload, IRegistPayload, IResponsePaymentDetail, IResponsePaymentAction, IUpdateSTPayload, IResponseST, IInstallPayload } from '../types/dmm';

export class DmmService {
  private responseText = {
    // tslint:disable-next-line: object-literal-key-quotes
    '0': '载入成功',
    '-1': '似乎输入了错误的数据',
    '-2': '服务器网络通信故障',
    '-10': '没找到DMM验证信息',
    '-11': '没找到验证信息',
    '-12': '似乎DMM修改了数据格式',
    '-13': 'DMM要求更改用户密码',
    '-14': '对DMM输入了错误的数据',
    '-15': '需要先安装这个游戏',
    '-16': '这个游戏已经安装过了',
    '-17': '验证信息已经过期',
    '-18': '无效的用户名和密码',
    '-19': 'DMM强制要求页面重定向',
    '-20': '需要完善账号信息',
    '-100': '浏览器与服务器通信失败',
    '-101': '丢失了登录凭据, 需重新登录',
    '-110': '登录器服务端回报了无效的数据',
  };
  private readonly url = 'http://zazck.s1001.xrea.com/services/1562817725000/api.php';
  public emiter = new EventEmitter();

  private createFormData(input?: any) {
    const result = new FormData();
    if (input) {
      Object.keys(input).forEach((k) => {
        const v: any = input[k];
        result.append(k, ((v === true) || (v === false)) ? +v : v);
      });
    }
    const cookies = SettingService.cookies;
    if (cookies) {
      result.append('cookies', JSON.stringify(cookies));
    } else {
      result.append('cookies', '[]');
    }
    return result;
  }

  private async request<T>(input: RequestInfo, init?: RequestInit): Promise<IResponseData<T> | IResponseError | IResponseMessage> {
    const response: Response | null = await fetch(input, init)
      .catch(() => {
        this.emiter.emit('message', this.responseText[OpCode.CLIENT_NETWORK_ERROR]);
        return null;
      });
    if (!response) {
      return {
        code: OpCode.CLIENT_NETWORK_ERROR,
        data: this.responseText[OpCode.CLIENT_NETWORK_ERROR],
        cookies: [],
      } as IResponseError;
    }
    const result: IResponseData<T> | IResponseError | IResponseMessage | null = await response.json()
      .catch(() => {
        this.emiter.emit('message', this.responseText[OpCode.SERVER_INVALID_RESPONSE]);
        return null;
      });
    if (!result) {
      return {
        code: OpCode.SERVER_INVALID_RESPONSE,
        data: this.responseText[OpCode.SERVER_INVALID_RESPONSE],
        cookies: [],
      } as IResponseError;
    }
    if (result.cookies) {
      SettingService.cookies = result.cookies;
    }
    this.emiter.emit('message', this.responseText[result.code]);
    if (result.code === OpCode.OK) {
      return result;
    }
    if (result.code === OpCode.DMM_TOKEN_EXPIRED) {
      SettingService.cookies = [];
      SettingService.authenticated = false;
    }
    return result;
  }

  public async login(payload: ILoginPayload, exchange?: boolean): Promise<IResponseMessage | IResponseError> {
    const data = this.createFormData(payload);
    data.append('method', exchange ? 'login_exchange' : 'login');
    const result = await this.request(this.url, {
      method: 'POST',
      body: data,
    }) as IResponseMessage | IResponseError;
    if (result.code === OpCode.OK) {
      if (payload.save_login_id) {
        SettingService.loginID = payload.login_id;
      } else {
        SettingService.loginID = undefined;
      }
      if (payload.save_password) {
        SettingService.password = payload.password;
      } else {
        SettingService.password = undefined;
      }
      if (payload.use_auto_login) {
        SettingService.autoLogin = true;
      } else {
        SettingService.autoLogin = undefined;
      }
      if (exchange) {
        SettingService.category = 'exchange';
      } else {
        SettingService.category = 'general';
      }
      SettingService.authenticated = true;
    }
    return result;
  }

  public async logout(): Promise<IResponseMessage | IResponseError> {
    const data = this.createFormData();
    data.append('method', 'logout');
    const result = await this.request(this.url, {
      method: 'POST',
      body: data,
    }) as IResponseMessage | IResponseError;
    if (result.code === OpCode.OK) {
      SettingService.authenticated = false;
    }
    return result;
  }

  public async install(payload: IInstallPayload): Promise<IResponseData<IResponseGameFrame> | IResponseError> {
    if (!SettingService.cookies) {
      return {
        code: OpCode.CLIENT_NETWORK_ERROR,
        data: this.responseText[OpCode.CLIENT_NETWORK_ERROR],
        cookies: [],
      } as IResponseError;
    }
    const data = this.createFormData(payload);
    data.append('method', 'install');
    return this.request(this.url, {
      method: 'POST',
      body: data,
    }) as Promise<IResponseData<IResponseGameFrame> | IResponseError>;
  }

  public async run(payload: IRunPayload): Promise<IResponseData<IResponseGameFrame> | IResponseError> {
    if (!SettingService.cookies) {
      return {
        code: OpCode.CLIENT_NETWORK_ERROR,
        data: this.responseText[OpCode.CLIENT_NETWORK_ERROR],
        cookies: [],
      } as IResponseError;
    }
    const data = this.createFormData(payload);
    data.append('method', 'run');
    return this.request(this.url, {
      method: 'POST',
      body: data,
    }) as Promise<IResponseData<IResponseGameFrame> | IResponseError>;
  }

  public async updateST(payload: IUpdateSTPayload): Promise<IResponseData<IResponseST> | IResponseError> {
    if (!SettingService.cookies) {
      return {
        code: OpCode.CLIENT_NETWORK_ERROR,
        data: this.responseText[OpCode.CLIENT_NETWORK_ERROR],
        cookies: [],
      } as IResponseError;
    }
    const data = this.createFormData(payload);
    data.append('method', 'update_st');
    return this.request(this.url, {
      method: 'POST',
      body: data,
    }) as Promise<IResponseData<IResponseST> | IResponseError>;
  }

  public async regist(payload: IRegistPayload): Promise<IResponseData<null> | IResponseError> {
    if (!SettingService.cookies) {
      return {
        code: OpCode.CLIENT_NETWORK_ERROR,
        data: this.responseText[OpCode.CLIENT_NETWORK_ERROR],
        cookies: [],
      } as IResponseError;
    }
    const data = this.createFormData(payload);
    data.append('method', 'regist');
    return this.request(this.url, {
      method: 'POST',
      body: data,
    }) as Promise<IResponseData<null> | IResponseError>;
  }

  public async requestPayment(payload: IRequestPaymentPayload): Promise<IResponseData<IResponsePaymentDetail> | IResponseError> {
    if (!SettingService.cookies) {
      return {
        code: OpCode.CLIENT_NETWORK_ERROR,
        data: this.responseText[OpCode.CLIENT_NETWORK_ERROR],
        cookies: [],
      } as IResponseError;
    }
    const data = this.createFormData(payload);
    data.append('method', 'request_payment');
    return this.request(this.url, {
      method: 'POST',
      body: data,
    }) as Promise<IResponseData<IResponsePaymentDetail> | IResponseError>;
  }

  public async paymentCommit(payload: IRequestPaymentPayload): Promise<IResponseData<IResponsePaymentAction> | IResponseError> {
    if (!SettingService.cookies) {
      return {
        code: OpCode.CLIENT_NETWORK_ERROR,
        data: this.responseText[OpCode.CLIENT_NETWORK_ERROR],
        cookies: [],
      } as IResponseError;
    }
    const data = this.createFormData(payload);
    data.append('method', 'payment_commit');
    return this.request(this.url, {
      method: 'POST',
      body: data,
    }) as Promise<IResponseData<IResponsePaymentAction> | IResponseError>;
  }

  public async paymentCancel(payload: IRequestPaymentPayload): Promise<IResponseData<IResponsePaymentAction> | IResponseError> {
    if (!SettingService.cookies) {
      return {
        code: OpCode.CLIENT_NETWORK_ERROR,
        data: this.responseText[OpCode.CLIENT_NETWORK_ERROR],
        cookies: [],
      } as IResponseError;
    }
    const data = this.createFormData(payload);
    data.append('method', 'payment_cancel');
    return this.request(this.url, {
      method: 'POST',
      body: data,
    }) as Promise<IResponseData<IResponsePaymentAction> | IResponseError>;
  }
}

// tslint:disable-next-line: variable-name
export const DMMService = new DmmService();
