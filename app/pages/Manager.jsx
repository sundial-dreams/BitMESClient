import React, { Component, useState } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import { history } from '../store/configureStore';
import routers from '../constants/routers';
import MachineManager from './MachineManager';
import WorkpieceManager from './WorkpieceManager';
import ProcessManager from './ProcessManager';

import style from './Manager.less';

const { Content, Header } = Layout;

const ManagerMenu = () => {
  const [currentKey, setCurrentKey] = useState('machine');
  const menuType = ['machine', 'workpiece', 'process', 'mail'];
  const icons = ['cluster', 'inbox', 'branches', 'mail'];
  const paths = [routers.MANAGER_MACHINE, routers.MANAGER_WORKPIECE, routers.MANAGER_PROCESS, routers.MAIL];
  return (
    <Menu mode="horizontal" style={ { background: 'transparent', borderBottom: 'none' } }
          selectedKeys={ [currentKey] }
          onClick={ e => setCurrentKey(e.key) }>
      {
        menuType.map((type, i) => <Menu.Item key={ type } onClick={ () => history.push(paths[i]) }>
          <Icon type={ icons[i] } style={ { margin: '0 auto' } }/>
        </Menu.Item>)
      }
    </Menu>
  );
};

export default class Manager extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    history.push(routers.MANAGER_MACHINE);
  }

  render () {
    return (
      <div id="__page" className={ style.more }>
        <Header style={ { background: 'transparent', padding: '1rem 0 0 0', borderBottom: 'none' } }>
          <ManagerMenu/>
        </Header>
        <Content style={ { background: 'transparent', height: 'calc(100vh - 64px)' } }>
          <Route exact path={ routers.MANAGER_MACHINE } component={ MachineManager }/>
          <Route path={ routers.MANAGER_WORKPIECE } component={ WorkpieceManager }/>
          <Route path={ routers.MANAGER_PROCESS } component={ ProcessManager }/>
        </Content>
      </div>
    );
  }
}