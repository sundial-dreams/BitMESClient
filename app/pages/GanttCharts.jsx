import React, { Component } from 'react';
import ReactChart from 'echarts-for-react';
import { makeGanttChartOption, Mode } from '../utils/ganttChartOption';
import { Icon, Row, Col, Select, Switch, Button, Tag, Statistic, Card, Empty, Timeline, message } from 'antd';
import Colors from '../constants/colors';
import * as PropTypes from 'prop-types';
import style from './Chart.less';
import '../app.global.css';
import { connect } from 'react-redux';
import { queryScheduleHistory, queryScheduleResult } from '../graphql/query';
import { Loading } from '../components/Components';
import { scheduleResultComing } from '../actions/action';

function EmptyPage (props) {
  return (<Empty style={ { height: '80vh', boxSizing: 'border-box', paddingTop: '30vh' } }
                 description={
                   <span style={ { color: '#C8CACA' } }> No Data! </span>
                 }>
    <Button type="primary" style={ { marginRight: '1rem' } }> Import </Button>
    <Button type="primary" style={ { marginLeft: '1rem' } }> Create </Button>
  </Empty>);
}

class ToolBox extends Component {
  static propTypes = {
    onSort: PropTypes.func,
    mode: PropTypes.string,
    onModeChange: PropTypes.func,
    rule: PropTypes.string,
    onRuleChange: PropTypes.func,
    onShowGrid: PropTypes.func
  };

  constructor (props) {
    super(props);
  }

  render () {
    const { onSort, mode, onModeChange, rule, onRuleChange, onShowGrid } = this.props;
    return (<div className={ style.toolBox }>
      <h4>Schedule Gantt Chart</h4>
      <div className={ style.toolGroup }>
        <div>
          <span className={ style.title }>mode </span>
          <Select value={ mode } onChange={ onModeChange } size="small" style={ { width: '7rem' } }>
            <Select.Option value="machine">machine</Select.Option>
            <Select.Option value="workpiece">workpiece</Select.Option>
          </Select>
        </div>
        <div>
          <span className={ style.title }>Rule </span>
          <Select value={ rule } onChange={ onRuleChange } size="small">
            <Select.Option value="time">Time</Select.Option>
            <Select.Option value="task">Task</Select.Option>
          </Select>
        </div>
        <div>
          <span className={ style.title }>Grid </span>
          <Switch size="small" onChange={ onShowGrid }/>
        </div>
      </div>
    </div>);
  }
}

class ChartBlock extends Component {
  static propTypes = {
    scheduleResult: PropTypes.object
  };
  state = {
    showGrid: false,
    mode: Mode.MACHINE,
    dataSource: [],
    rule: 'time'
  };

  constructor (props) {
    super(props);
  }


  render () {
    const { fulfillTime, result = [] } = this.props.scheduleResult;
    const { dataSource, mode, showGrid } = this.state;
    return (<div className={ style.ganttChartArea }>
      <div className={ style.header }>
        <h3>
          PROCESS SCHEDULE
          <Button type="primary"
                  size="small"
                  shape="circle"
                  style={ { float: 'right', background: '#E09EFF', borderColor: '#E09EFF' } }>
            <Icon type="export"/>
          </Button>
        </h3>
      </div>
      <ToolBox mode={ this.state.mode }
               rule={ this.state.rule }
               onShowGrid={ () => this.setState(state => ({ showGrid: !state.showGrid })) }
               onModeChange={ mode => this.setState({ mode }) }
               onSort={ () => {} }
               onRuleChange={ () => {} }/>
      <ReactChart option={ makeGanttChartOption({ dataSource: result, mode, showGrid }) }
                  style={ { height: '90%' } }/>
    </div>);
  }
}

ChartBlock = connect(({ reducer: { scheduleResult } }) => ({
  scheduleResult
}))(ChartBlock);

/*
let timeLine = [
  { id: 'chart 01', time: '2000-11-04', description: 'undefined' },
  { id: 'chart 02', time: '2000-11-04', description: 'undefined' },
  { id: 'chart 03', time: '2000-11-04', description: 'undefined' },
  { id: 'chart 04', time: '2000-11-04', description: 'undefined' },
  { id: 'chart 05', time: '2000-11-04', description: 'undefined' },
  { id: 'chart 06', time: '2000-11-04', description: 'undefined' },
  { id: 'chart 07', time: '2000-11-04', description: 'undefined' },
  { id: 'chart 08', time: '2000-11-04', description: 'undefined' },
  { id: 'chart 09', time: '2000-11-04', description: 'undefined' }
];
*/
class AnalysisBlock extends Component {
  static propTypes = {
    scheduleResult: PropTypes.object,
    scheduleResultComing: PropTypes.func,
    onDataLoading: PropTypes.func
  };
  state = {
    dataSource: [],
    fetching: true,
    currentSelect: 0
  };

  componentDidMount () {
    this.setState({ fetching: true });
    this.props.onDataLoading(true);
    queryScheduleHistory().then(dataSource => {
      dataSource = dataSource.sort((a, b) => {
        let aTime = new Date(a.time).getTime(),
            bTime = new Date(b.time).getTime();
        return bTime - aTime;
      });
      this.setState({ dataSource });
      let id = dataSource[0].id;
      console.log(id);
      if (!id) { this.props.onDataLoading(false, false); }
      // id !== undefined
      !!id && queryScheduleResult(id).then(([scheduleResult]) => {
        this.props.scheduleResultComing(scheduleResult);
        this.setState({ fetching: false });
        this.props.onDataLoading(false);
      });
      // this.props.scheduleResultComing();
    });
  }

  handleInspect = (id, currentSelect) => {
    let loading = message.loading('waiting ...', 1);
    queryScheduleResult(id).then(([scheduleResult]) => {
      loading.then(() => {
        this.props.scheduleResultComing(scheduleResult);
        this.setState({ currentSelect });
        message.success('query success!');
      }, null);
    });
  };

  render () {
    let { fulfillTime } = this.props.scheduleResult;
    return (<div className={ style.analysis }>
      <h3>STATISTIC</h3>
      <Row>
        <Col span={ 12 }>
          <Card>
            <Statistic title="Total time"
                       value={ fulfillTime }
                       suffix="h"
                       valueStyle={ { color: '#BB86D7' } }
                       prefix={ <Icon type="clock-circle"/> }
            />
          </Card>
        </Col>
        <Col span={ 11 } offset={ 1 }>
          <Card>
            <Statistic title="Usage rate"
                       value={ 80 }
                       suffix="%"
                       valueStyle={ { color: '#5BC3EB' } }
                       prefix={ <Icon type="arrow-up"/> }/>
          </Card>
        </Col>
      </Row>
      <div className={ style.history }>
        <h3>
          HISTORY
          <Button type="link"
                  style={ { color: 'gray', float: 'right' } }>
            More
          </Button>
        </h3>
        { this.state.fetching ? <Loading/> : <Timeline mode="left">
          { this.state.dataSource.map((v, i) => {
            let color = i === 0 ? 'green' : i % 2 ? 'blue' : Colors.C;
            let icon = this.state.currentSelect === i ? <Icon type="check" style={ { color: 'lime' } }/> : null;
            return (<Timeline.Item key={ v.id }
                                   dot={ i === 0 ? <Icon type="clock-circle"/> : null }
                                   color={ color }>
              <Tag color="lime"> { v.id }</Tag>
              <Tag color="blue">{ v.time }</Tag>
              { icon }
              <Button type="link"
                      style={ { color: '#ccc', width: '60%' } }
                      onClick={ () => this.handleInspect(v.id, i) }
              >
                <Icon type="search"/> Inspect
              </Button>
            </Timeline.Item>);
          }) }
        </Timeline> }
      </div>
    </div>);
  }
}

AnalysisBlock = connect(({ reducer: { scheduleResult } }) => ({ scheduleResult }),
  (dispatch) => ({
    scheduleResultComing: (data) => dispatch(scheduleResultComing(data))
  }))(AnalysisBlock);

class GanttCharts extends Component {
  static propTypes = {
    scheduleResult: PropTypes.object
  };
  state = {
    hasData: true,
    loadingData: true
  };

  constructor (props) {
    super(props);
  }

  handleDataLoading = (state, hasData = true) => {
    this.setState({ loadingData: state, hasData });
  };

  render () {

    return <div id="__page" className={ style.ganttChart }>
      { this.state.hasData ? <Row>
        <Col span={ 6 }><AnalysisBlock onDataLoading={ this.handleDataLoading }/></Col>
        <Col span={ 18 }><ChartBlock/></Col>
      </Row> : <EmptyPage/> }
    </div>;
  }
}

export default connect(({ reducer: { scheduleResult } }) => ({
  scheduleResult
}))(GanttCharts);