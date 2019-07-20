import React from 'react';

import { Switch, Route } from 'react-router';
import { Layout } from 'antd';

import App from './containers/App';
import TitleBar from './components/TitleBar';
import AppMenu from './components/AppMenu';
import ToolBox from './components/ToolBox';
import Home from './pages/Home';
import Chart from './pages/Chart';
import Report from './pages/Report';
import Manager from './pages/Manager';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import { LoadingPage } from './components/Components';
import routers from './constants/routers';

const { Sider } = Layout;
const layoutHiddenStyle = {
  visibility: 'hidden', opacity: 0
};
const layoutVisibleStyle = {
  visibility: 'visible', opacity: 1
};

class BitMES extends React.Component {
  static propTypes = {
    isLogin: PropTypes.bool
  };

  state = {
    loadingPage: true
  };

  constructor (props) {
    super(props);

  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        loadingPage: false
      });
    }, 2000);
  }

  render () {
    let width = this.props.isLogin ? '4rem' : '100vw';
    return (
      <App>
        <TitleBar/>
        <LoadingPage loading={ this.state.loadingPage }/>
        { this.state.loadingPage ||
        <React.Fragment>
          <ToolBox/>
          <Layout>
            <Sider width={ width } style={
              { transition: '.5s', backgroundColor: '#212427' }
            }>
              <AppMenu width={ width }/>
            </Sider>
            <Layout style={
              {
                backgroundColor: 'white', /*transition: '.5s',*/ ...(this.props.isLogin ? layoutVisibleStyle : layoutHiddenStyle)
              }
            }>
              <Switch>
                <Route path={ routers.HOME } component={ Home } exact/>
                <Route path={ routers.MANAGER } component={ Manager }/>
                <Route path={ routers.CHART } component={ Chart }/>
                <Route path={ routers.REPORT } component={ Report }/>
              </Switch>
            </Layout>
          </Layout>
        </React.Fragment>
        }
      </App>);
  }
}

export default connect(
  ({ reducer: { isLogin } }) => ({ isLogin })
)(BitMES);
