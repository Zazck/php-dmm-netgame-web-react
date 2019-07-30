// tslint:disable-next-line: import-name
import React from 'react';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { SettingService } from '../services/setting.service';
import { StaticContext, RouteProps, withRouter } from 'react-router';

class AuthGuardRoute extends React.Component<RouteProps & RouteComponentProps<any, StaticContext, any>, any> {
  render = () => {
    // tslint:disable-next-line: variable-name
    const { component: Component, ...rest }: { component?: any, rest?: any[] } = this.props;
    if (!SettingService.category || !SettingService.authenticated) {
      return <Route {...rest} render={ () => <Redirect to={ '/auth' } push={ true } /> }></Route>;
    }
    return <Route {...rest} render={ () => <Component {...this.props} /> } />;
  }
}

export default withRouter(AuthGuardRoute);
