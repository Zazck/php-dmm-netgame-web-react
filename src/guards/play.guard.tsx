// tslint:disable-next-line: import-name
import React from 'react';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { SettingService } from '../services/setting.service';
import { StaticContext, RouteProps, withRouter } from 'react-router';

class PlayGuardRoute extends React.Component<RouteProps & RouteComponentProps<any, StaticContext, any>, any> {
  render() {
    // tslint:disable-next-line: variable-name
    const { component: Component, ...rest }: { component?: any, rest?: any[] } = this.props;
    if (!SettingService.category || !SettingService.authenticated) {
      return <Redirect to={ '/auth' } push={ true } />;
    }
    const search = this.props.location!.search;
    const params = new URLSearchParams(search);
    const searchCategory = params.get('category');
    const searchName = params.get('name');
    // parameter not provided
    if (!searchCategory || !searchName) {
      if (!SettingService.game || !SettingService.gameCategory) {
        return <Redirect to={ '/game-list' } />;
      }
      const search = new URLSearchParams();
      search.append('name', SettingService.game);
      search.append('category', SettingService.gameCategory);
      return <Redirect to={ { pathname: '/', search: `?${search.toString()}` } } />;
      // return <Route {...rest} render={ () => <Component {...this.props} /> } />;
    }
    // incorrect parameter
    if ((searchCategory !== 'general') && (searchCategory !== 'adult')) {
      return <Redirect to={ '/game-list' } />;
    }
    // user is trying to start an adult game without adult site cookies
    if (searchCategory !== 'general' && SettingService.category === 'general') {
      return <Redirect to={ '/game-list' } />;
    }
    return <Component {...this.props} />;
  }
}

export default withRouter(PlayGuardRoute);
