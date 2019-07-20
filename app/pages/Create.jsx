import React, { Component } from 'react';
import { Table, Button, Icon, Tag, Input, Popconfirm, Empty, message } from 'antd';
import Colors from '../constants/colors';
import { reshapeData } from '../utils/utils';
import { queryProcess } from '../graphql/query';
import { history as Router } from '../store/configureStore';
import routers from '../constants/routers';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loading } from '../components/Components';
import { scheduleResultComing } from '../actions/action';

import style from './Chart.less';
import '../app.global.css';
import { useSchedule } from '../graphql/mutation';

const dataSource = Array.from({ length: 200 }, v => ({
  workpiece: '#fccc',
  machine: '#adaca',
  process: 'und',
  totalTime: 20,
  beforeProcess: '#abcd'
}));

function makeColumns (onEditColumns, onDeleteColumns) {
  return [
    {
      title: 'Process',
      dataIndex: 'name',
      key: 'name',
      width: '15rem',
      render (process) {
        let [id, name] = process.split('.');
        return <span>
        <Tag color="blue">{ id }</Tag><Tag color="lime">{ name }</Tag>
      </span>;
      }
    },
    {
      title: 'Workpiece',
      dataIndex: 'workpiece',
      key: 'workpiece',
      width: '6rem',
      render (workpiece) {
        console.log(workpiece);
        return <span>
        <Tag color="blue">{ workpiece }</Tag>
      </span>;
      }
    },
    {
      title: 'Machine',
      dataIndex: 'machine',
      key: 'machine',
      width: '6rem',
      render (machine) {
        return <span style={ { color: 'gray' } }>
        <Tag color="lime">{ machine }</Tag>
      </span>;
      }

    },
    {
      title: 'Before process',
      dataIndex: 'beforeProcess',
      key: 'beforeProcess',
      width: '10rem',
      render (beforeProcess) {
        return <span style={ { color: 'gray' } }>
        <Tag color="pink">{ beforeProcess }</Tag>
      </span>;
      }
    },
    {
      title: 'Charge of',
      dataIndex: 'chargeOf',
      key: 'chargeOf',
      width: '8rem',
      render (chargeOf) {
        return <span style={ { color: 'gray' } }>
        <Tag color="pink">{ chargeOf }</Tag>
      </span>;
      }
    },
    {
      title: 'Total time',
      dataIndex: 'time',
      key: 'time',
      width: '6rem',
      render (totalTime) {
        return <span style={ { color: 'red' } }>
        <Icon type="clock-circle" style={ { color: 'red' } }/> { totalTime }h
      </span>;
      }

    },
    {
      title: 'More',
      key: 'more',
      width: '10rem',
      render (text, record) {
        return <div style={ { height: '3.5vh' } }>
          <Button type="link"
                  style={ { marginRight: '1rem' } }
                  size="small"
                  onClick={ () => onEditColumns(record) }>
            <Icon type="edit"/>
          </Button>
          <Popconfirm title={ `delete ${ record.workpiece }?` } onConfirm={ () => onDeleteColumns(record) }>
            <Button type="link" style={ { color: 'red' } } size="small">
              <Icon type="delete"/>
            </Button>
          </Popconfirm>
          <Button type="link" style={ { color: '#CCCCCC' } } size="small">
            <Icon type="more"/>
          </Button>
        </div>;
      }
    }
  ];
}

const createButtonStyle = (color) => ({
  backgroundColor: color,
  borderColor: color
});


class Create extends Component {
  static propTypes = {
    scheduleResultComing: PropTypes.func,
    scheduleResult: PropTypes.object
  };
  state = {
    searchText: '',
    dataSource: [],
    modalVisible: false,
    selectedRowKeys: [],
    dataSourceFetching: true
  };

  constructor (props) {
    super(props);
    this.columns = makeColumns(this.onEditColumns, this.onDeleteColumns);
  }

  componentDidMount () {
    this.setState({ dataSourceFetching: true });
    queryProcess().then(dataSource => {
      dataSource = dataSource.map(v => ({ ...v, name: v.id + '.' + v.name }));
      this.setState({ dataSource, dataSourceFetching: false });
    });
  }

  onEditColumns = record => {
    console.log(record);
  };

  onDeleteColumns = record => {
    this.setState(state => ({
      dataSource: state.dataSource.filter(v => v !== record)
    }));
  };

  handleExecute = () => {
    const set = new Set(this.state.selectedRowKeys);
    // console.log(this.state.dataSource.filter((v, i) => set.has(i)));
    if (set.size <= 3) {
      message.error('you selected row was to less!');
      return;
    }
    let data = null;
    try {
      data = reshapeData(this.state.dataSource.filter((v, i) => set.has(i)));
    } catch (e) {
      message.error('you have error in process!');
    }
    const loading = message.loading('waiting to process...');
    console.log(data);
    useSchedule({ parameter: data }).then(res => {
      loading.then(() => {
        message.success('process success!');
        Router.push(routers.CHART_GANTT);
        this.props.scheduleResultComing(res);
      }, null);
    });
  };

  handleSelectChange = (selectedRowKeys) => {
    this.setState(({ selectedRowKeys }));
  };

  render () {
    const { selectedRowKeys } = this.state;
    return (
      <div className={ style.create } id="__page">
        <div className={ style.title }>
          <div>
            <h3 style={ { color: 'gray', fontWeight: 'bold' } }>PROCESS SCHEDULE</h3>
          </div>
          <div>
            <Button size="small"
                    type="primary"
                    shape="circle"
                    style={ createButtonStyle(Colors.theme.lightpink) }>
              <Icon type="reload"/>
            </Button>
            <Button size="small"
                    type="primary"
                    shape="circle"
                    style={ createButtonStyle(Colors.theme.blue) }>
              <Icon type="import"/>
            </Button>
            <Button size="small"
                    type="primary"
                    shape="circle"
                    style={ createButtonStyle(Colors.theme.purple) }
                    onClick={ () => this.setState({ modalVisible: true }) }
            >
              <Icon type="plus"/>
            </Button>
            <Button size="small"
                    type="primary"
                    shape="circle"
                    onClick={ this.handleExecute }
                    style={ createButtonStyle(Colors.theme.pink) }>
              <Icon type="upload"/>
            </Button>
          </div>
        </div>
        { this.state.dataSourceFetching ? <Loading text="Fetching process..."/> :
          <Table columns={ this.columns }
                 dataSource={ this.state.dataSource }
                 pagination={ {
                   total: this.state.dataSource.length,
                   pageSize: 9,
                   size: 'small',
                   hideOnSinglePage: true,
                   showTotal (total, range) {
                     return `${ range[0] }-${ range[1] } of ${ total } items`;
                   }
                 } }
                 rowSelection={ {
                   selectedRowKeys,
                   onChange: this.handleSelectChange
                 } }
                 bodyStyle={ { height: '78vh' } }
                 style={ {
                   overflow: 'hidden',
                   height: '84.5vh'
                 } }/> }
        />
      </div>
    );
  }
}

export default connect(({ reducer: { scheduleResult } }) => ({
  scheduleResult
}), dispatch => ({
  scheduleResultComing: (data) => dispatch(scheduleResultComing(data))
}))(Create);


