import React, { Component } from 'react';
import { Layout, Menu, Icon, Button, Row, Col, Statistic, Progress, Input, Timeline } from 'antd';
import ReactChart from 'echarts-for-react';
import { machineStateOption, machineWorkOption, produceModuleOption } from '../utils/echartsOption';
import style from './Home.less';
import '../app.global.css';

const { Header, Content } = Layout;
const { SubMenu, Item, ItemGroup } = Menu;

const Legend = ({ name, value, color }) => <div className={ style.legend }>
  <span style={ { background: color } }/> { name } <em style={ { color: color } }>{ value }</em>
</div>;

const machineState = [
  { name: 'idle', value: 4, color: '#9EFFF2' },
  { name: 'work', value: 20, color: '#BCBCFF' },
  { name: 'maintain', value: 3, color: '#E09EFF' },
  { name: 'broken', value: 4, color: '#F3B2FF' }
];

const MachineStateBlock = props => {
  return (<div className={ style.machineState }>
    <div className={ style.header }>
      <h3>MACHINE STATE</h3>
      <Button type="primary" shape="circle" icon="plus" style={
        { float: 'right', background: '#E09EFF', borderColor: '#E09EFF' }
      }/>
    </div>
    <div className={ style.center }>
      <div className={ style.left }>
        <ReactChart option={ machineStateOption }/>
      </div>
      <div className={ style.state }>
        { machineState.map(v => <Legend key={ v.name } { ...v } />) }
      </div>
    </div>
  </div>);
};


const ProcessProgressBlock = props => {
  return (<div className={ style.processProgress }>
    <div className={ style.header }>
      <h3> PROCESS PROGRESS </h3>
      <Progress type="circle"
                percent={ 75 }
                strokeColor="#9EFFF2"
                strokeWidth={ 10 }
                style={ { marginRight: '1rem' } }
      />
      <Progress type="circle"
                percent={ 75 }
                strokeColor="#F3B2FF"
                strokeWidth={ 10 }
                style={ { marginLeft: '1rem' } }
      />
    </div>
    <div className={ style.footer }>
      <h3> MORE </h3>
      { [40, 20, 60].map(v => (
        <Progress key={ v }
                  percent={ v }
                  strokeWidth={ 10 }
                  strokeColor="#F3B2FF"
        />
      )) }
    </div>
  </div>);
};

const WorksBlock = props => (<div className={ style.works }>
  <h3>WORKS
    <Button type="primary"
            shape="circle"
            style={ { background: '#F3B2FF', borderColor: '#F3B2FF', float: 'right' } }>
      <Icon type="ellipsis"/>
    </Button>
  </h3>
  <div className={ style.header }>
    <Statistic title="TODO"
               value={ 10 }
               valueStyle={ { color: '#F3B2FF' } }
               prefix={ <Icon type="form"/> }
               suffix="%"
    />

    <Statistic title="FULFILL"
               value={ 10 }
               valueStyle={ { color: '#E09EFF' } }
               prefix={ <Icon type="check"/> }
               suffix="%"
    />

    <Statistic title="PENDING"
               value={ 10 }
               valueStyle={ { color: '#9EFFF2' } }
               prefix={ <Icon type="sliders"/> }
               suffix="%"
    />
  </div>
  <Timeline mode="alternate">
    <Timeline.Item color="#9EFFF2">
      Start a work 2019-06-27
    </Timeline.Item>

    <Timeline.Item color="#BCBCFF">
      Start a work 2019-06-27
    </Timeline.Item>

    <Timeline.Item color="#E09EFF"
                   dot={ <Icon type="clock-circle-o"
                               style={ { fontSize: '18px', color: '#E09EFF' } }/> }>
      <p>Start a work 2019-06-27</p>
      <p>Start a work 2019-06-27</p>
      <p>Start a work 2019-06-27</p>
    </Timeline.Item>

    <Timeline.Item color="#F3B2FF">
      Start a work 2019-06-27
    </Timeline.Item>

  </Timeline>

</div>);
const MachineWorkChartBlock = props => (
  <div className={ style.machineWorkChart }>
    <h3>MACHINE WORK</h3>
    <ReactChart option={ machineWorkOption } style={ { height: '104%' } }/>
  </div>
);

const ProduceModuleChartBlock = props => (
  <div className={ style.produceModuleChart }>
    <h3>PRODUCE MODULE</h3>
    <ReactChart option={ produceModuleOption } style={ { height: '104%' } }/>
  </div>
);

class HomeMenu extends Component {
  itemStyle = { margin: '0 auto' };
  state = {
    currentKey: 'chart'
  };

  constructor (props) {
    super(props);

  }

  handleClick = e => {
    this.setState({ currentKey: e.key });
  };

  render () {
    return <Menu mode="horizontal"
                 style={ { background: 'transparent', borderBottom: 'none' } }
                 selectedKeys={ [this.state.currentKey] }
                 onClick={ this.handleClick }
    >
      <Item key="chart"> <Icon type="pie-chart" style={ this.itemStyle }/> </Item>
      <Item key="folder"> <Icon type="folder" style={ this.itemStyle }/> </Item>
      <Item key="mail"> <Icon type="mail" style={ this.itemStyle }/> </Item>
      <Item key="search">
        <Input.Search placeholder="function"
                      style={ { width: '10rem' } }
                      onSearch={ () => {} }
                      size="small"
        />
      </Item>
    </Menu>;
  }
}

export default class Home extends Component {
  constructor (props) {
    super(props);
  }

  render () {

    return (<div id="__page" className={ style.home }>
      <Header style={ { background: 'transparent', padding: '1rem 0 0 0', borderBottom: 'none' } }>
        <HomeMenu/>
      </Header>
      <Content style={ { background: 'transparent' } }>
        <Row>
          <Col span={ 9 }>
            <MachineStateBlock/>
          </Col>
          <Col span={ 6 }>
            <ProcessProgressBlock/>
          </Col>
          <Col span={ 9 }>
            <WorksBlock/>
          </Col>
        </Row>
        <Row>
          <Col span={ 12 }>
            <MachineWorkChartBlock/>
          </Col>
          <Col span={ 12 }>
            <ProduceModuleChartBlock/>
          </Col>
        </Row>
      </Content>
    </div>);
  }
}
