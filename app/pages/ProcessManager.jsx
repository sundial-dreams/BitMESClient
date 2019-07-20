import React, { Component } from 'react';
import {
  Row,
  Col,
  Table,
  Tag,
  Button,
  Empty,
  Icon,
  Input,
  Modal,
  Steps,
  Card,
  Statistic,
  Popover,
  message,
  Popconfirm,
  Select
} from 'antd';

import { queryMachineByName, queryProcess, queryWorkpieceByName, queryStaffByName } from '../graphql/query';
import { createProcess, deleteProcess, modifyProcess } from '../graphql/mutation';
import { Loading } from '../components/Components';
import * as PropTypes from 'prop-types';

import style from './Manager.less';
import '../app.global.css';
import { debounce } from '../utils/utils';

const loadingIcon = <Icon type="loading" spin/>;

class AddItemModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    onAdd: PropTypes.func,
    onCancel: PropTypes.func,
    dataSource: PropTypes.array
  };
  state = {
    name: '',

    workpiece: '',
    workpieceData: [],
    workpieceFetching: - 1,

    machine: '',
    machineData: [],
    machineFetching: - 1,

    chargeOf: '',
    chargeOfData: [],
    chargeOfFetching: - 1,

    beforeProcess: '',

    time: '',
    deliveryDate: '', // !
    description: ''
  };

  constructor (props) {
    super(props);

  }

  handleWorkpieceChange = value => this.setState({ workpiece: value });
  handleWorkpieceSearch = debounce(name => {
    this.setState({ workpieceData: [], workpieceFetching: true });
    queryWorkpieceByName(name).then(workpieceData => {
      this.setState({
        workpieceData,
        workpieceFetching: false
      });
    });
  });

  handleMachineChange = value => this.setState({ machine: value });
  handleMachineSearch = debounce(name => {
    this.setState({ machineData: [], machineFetching: true });
    queryMachineByName(name).then(machineData => {
      this.setState({
        machineData,
        machineFetching: false
      });
    });
  });

  handleChargeOfCharge = value => this.setState({ chargeOf: value });

  handleChargeOfSearch = debounce(name => {
    this.setState({ chargeOfFetching: true, chargeOfData: [] });
    queryStaffByName(name).then(chargeOfData => {
      this.setState({
        chargeOfData,
        chargeOfFetching: false
      });
    });

  });

  handleAddItem = () => {
    let { name, time, chargeOf, workpiece, machine, description, beforeProcess } = this.state;

    function parseId (string) {
      let strArr = string.split('.');
      return strArr[strArr.length - 1];
    }


    this.props.onAdd({
      name,
      time: Number.parseFloat(time),
      workpiece: parseId(workpiece.label),
      machine: parseId(machine.label),
      chargeOf: parseId(chargeOf.label),
      description,
      beforeProcess: parseId(beforeProcess)
    });
  };


  render () {
    const rowStyle = {
      margin: '0 0 1rem 0'
    };
    const labelStyle = {
      paddingTop: '.3rem'
    };
    const { workpieceFetching, machineFetching, chargeOfFetching, workpiece } = this.state;
    const { dataSource } = this.props;
    let mapDataSource = dataSource.map(v => {
      let [id, name] = v.name.split('.');
      return ({ ...v, name: name + '.' + id });
    });

    console.log(workpiece);

    const currentProcess = [{ name: 'Self' }, ...!!workpiece ? mapDataSource.filter(v => v.workpiece === workpiece.key) : mapDataSource];
    return (
      <Modal title="ADD WORKPIECE"
             centered
             visible={ this.props.visible }
             onOk={ this.handleAddItem }
             onCancel={ this.props.onCancel }
             okText="add"
             cancelText="cancel"
      >
        <Row gutter={ 16 } style={ rowStyle }>
          <Col span={ 5 } style={ labelStyle }>Name: </Col>
          <Col span={ 19 }>
            <Input placeholder="input workpiece name"
                   value={ this.state.name }
                   onChange={ e => this.setState({ name: e.target.value }) }/>
          </Col>
        </Row>
        <Row gutter={ 16 } style={ rowStyle }>
          <Col span={ 5 } stype={ labelStyle }>Workpiece</Col>
          <Col span={ 19 }>
            <Select style={ { width: '100%' } }
                    placeholder="select workpiece"
                    labelInValue
                    showSearch
                    showArrow={ false }
                    value={ this.state.workpiece }
                    onChange={ this.handleWorkpieceChange }
                    filterOption={ false }
                    onSearch={ this.handleWorkpieceSearch }
                    notFoundContent={ workpieceFetching !== - 1 ? workpieceFetching ? loadingIcon : <Empty/> : null }>
              { this.state.workpieceData.map(v =>
                <Select.Option key={ v.id }>{ v.name + '.' + v.id }</Select.Option>
              ) }
            </Select>
          </Col>
        </Row>
        <Row gutter={ 16 } style={ rowStyle }>
          <Col span={ 5 } style={ labelStyle }> Machine: </Col>
          <Col span={ 19 }>
            <Select style={ { width: '100%' } }
                    placeholder="select machine"
                    labelInValue
                    showSearch
                    showArrow={ false }
                    value={ this.state.machine }
                    onChange={ this.handleMachineChange }
                    filterOption={ false }
                    onSearch={ this.handleMachineSearch }
                    notFoundContent={ machineFetching === - 1 ? null : machineFetching ? loadingIcon : <Empty/> }>
              { this.state.machineData.map(v =>
                <Select.Option key={ v.id }>{ v.name + '.' + v.id }</Select.Option>
              ) }
            </Select>
          </Col>
        </Row>
        <Row gutter={ 16 } style={ rowStyle }>
          <Col span={ 5 } style={ labelStyle }>Charge Of: </Col>
          <Col span={ 19 }>
            <Select style={ { width: '100%' } }
                    placeholder="select charge of"
                    labelInValue
                    showSearch
                    showArrow={ false }
                    value={ this.state.chargeOf }
                    onChange={ this.handleChargeOfCharge }
                    filterOption={ false }
                    onSearch={ this.handleChargeOfSearch }
                    notFoundContent={ chargeOfFetching === - 1 ? null : chargeOfFetching ? loadingIcon : <Empty/> }>
              { this.state.chargeOfData.map(v =>
                <Select.Option key={ v.id }>{ v.name + '.' + v.id }</Select.Option>
              ) }
            </Select>
          </Col>
        </Row>
        <Row gutter={ 16 } style={ rowStyle }>
          <Col span={ 5 }>Before process:</Col>
          <Col span={ 19 }>
            <Select value={ this.state.beforeProcess }
                    style={ { width: '100%' } }
                    placeholder="select before process"
                    showSearch
                    showArrow={ false }
                    onChange={ beforeProcess => this.setState({ beforeProcess }) }
                    optionFilterProp="children"
                    filterOption={ (input, option) => {
                      return option.props.value.toLowerCase().includes(input.toLowerCase());
                    } }>
              {
                currentProcess.map(v => (<Select.Option key={ v.name } value={ v.name }>
                  { v.name }
                </Select.Option>))
              }
            </Select>
          </Col>
        </Row>
        <Row gutter={ 16 } style={ rowStyle }>
          <Col span={ 5 }>Time:</Col>
          <Col span={ 19 }>
            <Input placeholder="time"
                   value={ this.state.time }
                   onChange={ e => this.setState({ time: e.target.value }) }/>
          </Col>
        </Row>
        <label>Description</label>
        <Input.TextArea value={ this.state.description }
                        autosize={ { maxRows: 4, minRows: 4 } }
                        placeholder="input workpiece description"
                        onChange={ e => this.setState({ description: e.target.value }) }/>
      </Modal>
    );
  }

}

function createButtonStyle (color) {
  return {
    backgroundColor: color,
    borderColor: color
  };
}

function makeColumns (onColumnsEdit, onColumnsDelete, onColumnsMore) {
  onColumnsEdit = typeof onColumnsEdit === 'function' ? onColumnsEdit : (v => v);
  onColumnsDelete = typeof onColumnsDelete === 'function' ? onColumnsDelete : (v => v);
  onColumnsMore = typeof onColumnsMore === 'function' ? onColumnsMore : (v => v);

  return [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '15rem',
      render (name) {
        let [id, newName] = name.split('.');
        return <span>
          <Tag color="blue">{ id }</Tag><Tag color="lime">{ newName }</Tag>
        </span>;
      }
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: '7rem',
      render (time) {
        return <span style={ { color: 'red' } }>
         <Icon type="clock-circle"/> { time } h
        </span>;
      }
    },
    {
      title: 'Workpiece',
      dataIndex: 'workpiece',
      key: 'workpiece',
      width: '5rem',
      render (workpiece) {
        return <span>
          <Popover title={ 'name' }
                   content={ <div><span>func</span></div> }
                   trigger="click">
                     <Tag color="green">{ workpiece }</Tag>
          </Popover>
        </span>;
      }
    },
    {
      title: 'Machine',
      dataIndex: 'machine',
      key: 'machine',
      width: '5rem',
      render (machine) {
        return <span>
          <Popover title={ 'name' }
                   content={ <div><span>func</span></div> }
                   trigger="click"
          >
                   <Tag color="lime">{ machine }</Tag>
          </Popover>
        </span>;
      }
    },
    {
      title: 'Charge of',
      dataIndex: 'chargeOf',
      key: 'chargeOf',
      width: '5rem',
      render (chargeOf) {
        return <span>
          <Popover title={ 'name' }
                   content={ <div><span>func</span></div> }
                   trigger="click"
          >
                  <Tag color="blue">{ chargeOf }</Tag>
          </Popover>
        </span>;
      }
    },
    {
      title: 'Before process',
      dataIndex: 'beforeProcess',
      key: 'beforeProcess',
      width: '10rem',
      render (chargeOf) {
        return <span>
          <Popover title={ 'name' }
                   content={ <div><span>func</span></div> }
                   trigger="click">
          <Tag color="blue">{ chargeOf }</Tag>
          </Popover>
        </span>;
      }
    },
    {
      title: 'More',
      dataIndex: 'more',
      key: 'more',
      width: '8rem',
      render (text, record) {
        return <div style={ {
          height: '2.85vh',
          display: 'flex',
          justifyContent: 'space-around'
        } }>
          <Button type="link"
                  onClick={ () => onColumnsEdit(record) }
                  size="small">
            Edit
          </Button>
          <Popconfirm title={ `delete ${ record.name } ?` }
                      onConfirm={ () => onColumnsDelete(record) }>
            <Button type="link"
                    size="small"
                    style={ { color: 'red' } }>
              <Icon type="delete"/>
            </Button>
          </Popconfirm>

          <Button type="link"
                  size="small"
                  onClick={ () => onColumnsMore(record) }>
            <Icon type="more" style={ { color: 'gray' } }/>
          </Button>
        </div>;
      }
    }
  ];
}


class ToolBox extends Component {
  static propTypes = {
    onAdd: PropTypes.func,
    onSearch: PropTypes.func,
    total: PropTypes.number
  };

  constructor (props) {
    super(props);

  }

  render () {
    return (
      <div className={ style.toolBox }>
        <h3>
          Process ({ this.props.total })
        </h3>
        <div className={ style.buttonGroup }>
          <Input.Search placeholder="search process"
                        style={ { width: '12rem' } }
                        value=""
                        key="ff"
                        onSearch={ this.props.onSearch }
          />
          <Button shape="circle"
                  type="primary"
                  style={ createButtonStyle('rgba(123,131,121,0.62)') }
                  onClick={ this.props.onAdd }
          >
            <Icon type="plus"/>
          </Button>
        </div>
      </div>
    );
  }
}

export default class ProcessManager extends Component {
  state = {
    visible: false,
    dataSource: [],
    fetching: true
  };

  constructor (props) {
    super(props);
    this.columns = makeColumns(this.onEditItem, this.onDeleteItem, this.onMoreItem);
  }

  componentDidMount () {
    queryProcess().then(dataSource => {
      dataSource = dataSource.map(v => ({ ...v, name: `${ v.id }.${ v.name }` }));
      this.setState({ dataSource, fetching: false });
    });
  }

  onAddItem = data => {
    console.log(data);
    const loading = message.loading('waiting to add workpiece...', 1);
    createProcess(data).then(res => {
      console.log(data);
      loading.then(() => {
        if (res.err) {
          message.error('you have error on add workpiece!');
        } else {
          let id = res.process.id;
          message.success('success to add workpiece.');
          this.setState(state => ({
            dataSource: [{ ...data, name: `${ id }.${ data.name }` }, ...state.dataSource]
          }));
        }
      }, null);
    });
    this.setState({ visible: false });
  };

  onDeleteItem = (record) => {
    const loading = message.loading('waiting to delete workpiece', 1);
    const [id] = record.name.split('.');
    console.log(id);
    deleteProcess(id).then(res => {
      loading.then(() => {
        if (res.err) {
          message.error('you have error on delete!', 2);
        } else {
          message.success('success to delete.', 2);
          this.setState(state => ({ dataSource: state.dataSource.filter(v => v !== record) }));
        }
      }, null);
    });
  };

  onEditItem = record => {};

  onMoreItem = record => {};

  onCancel = () => {
    this.setState({ visible: false });
  };

  render () {
    return (
      <div id="__page" className={ style.processManager }>
        <AddItemModal visible={ this.state.visible }
                      onAdd={ this.onAddItem }
                      onCancel={ this.onCancel }
                      dataSource={ this.state.dataSource }
        />
        <Row gutter={ 20 }>
          <Col span={ 4 }>
            <h3>STATISTIC</h3>
            <Card style={ { marginBottom: '1rem' } }>
              <Statistic title="total workpiece" value={ 20 }/>
            </Card>
            <Card>
              <Statistic title="total machine" value={ 20 }/>
            </Card>
            <h3 style={ { marginTop: '1rem' } }>STEPS</h3>
            <Steps direction="vertical" current={ 0 } size="small">
              <Steps.Step title="create" description="create process"/>
              <Steps.Step title="manager" description="manager process"/>
              <Steps.Step title="delete" description="delete process"/>
            </Steps>
          </Col>
          <Col span={ 20 }>
            <ToolBox onAdd={ () => this.setState({ visible: true }) }
                     onSearch={ v => console.log(v) }
                     total={ this.state.dataSource.length }
            />
            {
              this.state.fetching ?
                <Loading text="loading process..."/>
                : this.state.dataSource.length ?
                <Table style={ { marginTop: '.5rem' } }
                       dataSource={ this.state.dataSource }
                       columns={ this.columns }
                       pagination={ {
                         pageSize: 10,
                         hideOnSinglePage: true,
                         size: 'small'
                       } }
                       bodyStyle={ { height: '78vh' } }/> :
                <Empty description="No data" style={ { marginTop: '20vh', color: '#CCCCCC' } }/>
            }
          </Col>
        </Row>
      </div>
    );
  }
}