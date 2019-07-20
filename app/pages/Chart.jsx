import React, { Component } from 'react';
import { Icon, Layout, Menu } from 'antd';
import { Switch, Route } from 'react-router-dom';
import CreateDataSource from './Create';
import GanttCharts from './GanttCharts';
import routers from '../constants/routers';
import { history as RouterManager } from '../store/configureStore';

import style from './Chart.less';
import '../app.global.css';

const { Header, Content } = Layout;
const { SubMenu, Item } = Menu;

const routersMap = {
  'chart': routers.CHART_GANTT,
  'create': routers.CHART_CREATE
};

class ChartMenu extends Component {
  itemStyle = { margin: '0 auto' };
  state = {
    currentKey: 'chart'
  };

  constructor (props) {
    super(props);
  }

  handleClick = e => {
    this.setState({ currentKey: e.key });
    console.log(e.key);
    routersMap[e.key] && RouterManager.push(routersMap[e.key]);
  };


  render () {
    return (
      <Menu mode="horizontal"
            style={ { background: 'transparent', borderBottom: 'none' } }
            selectedKeys={ [this.state.currentKey] }
            onClick={ this.handleClick }>
        <Item key="chart"> <Icon type="bar-chart" style={ this.itemStyle }/></Item>
        <Item key="create"><Icon type="plus" style={ this.itemStyle }/></Item>
        <Item key="mail"> <Icon type="mail" style={ this.itemStyle }/></Item>
      </Menu>
    );
  }

}

export default class Chart extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    RouterManager.push(routers.CHART_GANTT);
  }

  render () {
    return (
      <div id="__page" className={ style.chart }>
        <Header style={ { background: 'transparent', padding: '1rem 0 0 0' } }>
          <ChartMenu/>
        </Header>
        <Content style={ { background: 'transparent' } }>
          <Switch>
            <Route path={ routers.CHART_GANTT } component={ GanttCharts } exact/>
            <Route path={ routers.CHART_CREATE } component={ CreateDataSource }/>
          </Switch>
        </Content>
      </div>
    );
  }
}