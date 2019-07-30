import { default as React } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { SettingService } from '../services/setting.service';
import { StaticContext, RouteProps, withRouter } from 'react-router';

class AuthGuardRoute extends React.Component<RouteProps & RouteComponentProps<any, StaticContext, any>, any> {
  render = () => {
    // tslint:disable-next-line: variable-name
    const { component: Component }: { component?: any, rest?: any[] } = this.props;
    if (!SettingService.category || !SettingService.authenticated) {
      return <Redirect to={ '/auth' } push={ true } />;
    }
    return <Component { ...this.props } />;
  }
}

export default withRouter(AuthGuardRoute);
