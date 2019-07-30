// tslint:disable-next-line: import-name
import React, { Component, ReactNode } from 'react';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { SettingService } from '../../services/setting.service';
import { StaticContext } from 'react-router';
import { mapStateToProps, AppStore } from '../../store';
import { connect } from 'react-redux';
import { updateTitle } from '../../store/title.store';

class About extends React.Component<AppStore, any> {
  componentWillMount = () => {
    const title = '关于';
    this.props.updateTitle(title);
    document.title = `${ title } | 躲猫猫`;
  }
  render() {
    return <div>About works!</div>;
  }
}

export default connect(
  mapStateToProps,
  { updateTitle },
)(About);
