interface ISetting {
  autoLogin?: boolean;
  autoRedirect?: boolean;
  loginID?: string;
  password?: string;
  category?: 'general' | 'exchange'; // 'adult'
  game?: string;
  gameCategory?: 'general' | 'adult';
  cookies?: object;
  authenticated?: boolean;
  autoRelogin?: boolean;
}

// tslint:disable-next-line: variable-name
const SettingService: ISetting = {} as ISetting;

const settingNames = [
  'autoLogin',
  'autoRedirect',
  'loginID',
  'password',
  'category',
  'game',
  'gameCategory',
  'cookies',
  'authenticated',
  'autoRelogin',
];

for (const k of settingNames) {
  Object.defineProperty(SettingService, k, {
    get() {
      return JSON.parse(localStorage.getItem(k) || 'null');
    },
    set(v) {
      if (v === undefined) {
        localStorage.removeItem(k);
      } else {
        localStorage.setItem(k, JSON.stringify(v));
      }
    },
  });
}

export {
  SettingService,
};
