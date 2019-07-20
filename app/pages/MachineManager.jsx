import React, { Component, useState } from 'react';
import ReactChart from 'echarts-for-react';
import { option2, makePieChart } from '../utils/options';
import MachineListItem from '../components/MachineListItem';
import { Input, List, Icon, Row, Col, Button, Tag, Select, Modal, Skeleton, message, Empty } from 'antd';
import { machineState } from '../constants/constants';
import * as PropTypes from 'prop-types';
import { queryMachine } from '../graphql/query';
import { createMachine, deleteMachine, modifyMachine } from '../graphql/mutation';
import Colors from '../constants/colors';
import { queryStaffByName } from '../graphql/query';
import { debounce } from '../utils/utils';
import { Loading } from '../components/Components';

import style from './Manager.less';

const { Search } = Input;

class AddItemModal extends Component {
  static ModalType = {
    EDIT: 'edit',
    ADD: 'add'
  };
  static propTypes = {
    visible: PropTypes.bool,
    onAdd: PropTypes.func,
    onCancel: PropTypes.func,
    type: PropTypes.string,
    editOriginData: PropTypes.object,
    onEdit: PropTypes.func,
    editChange: PropTypes.object
  };
  state = {
    name: '',
    state: 'idle',
    chargeOf: '',
    description: '',
    chargeOfData: [],
    fetching: - 1
  };

  handleNameChange = e => {
    this.props.type === AddItemModal.ModalType.EDIT ? this.props.editChange.nameChange(e.target.value) : this.setState({ name: e.target.value });
  };
  handleStateChange = value => {
    this.props.type === AddItemModal.ModalType.EDIT ? this.props.editChange.stateChange(value) : this.setState({ state: value });
  };
  handleChargeOfChange = value => {
    this.props.type === AddItemModal.ModalType.EDIT ? this.props.editChange.chargeOfChange(value) : this.setState({
      chargeOf: value,
      chargeOfData: [],
      fetching: false
    });
  };
  handleDescriptionChange = e => {
    this.props.type === AddItemModal.ModalType.EDIT ? this.props.editChange.descriptionChange(e.target.value) :
      this.setState({ description: e.target.value });
  };

  handleSearch = debounce(name => {
    this.setState({ chargeOfData: [], fetching: true });
    queryStaffByName(name).then(chargeOfData => {
      this.setState({ chargeOfData, fetching: false });
    });
  });


  handleAddItem = () => {
    console.log('why?');
    let { name, chargeOf, state, description } = this.state;
    console.log(name, chargeOf, state, description);
    chargeOf = chargeOf.split('.').reverse()[0];
    // console.log(chargeOf);
    this.props.type === AddItemModal.ModalType.ADD ? this.props.onAdd({ name, chargeOf, state, description }) :
      this.props.onEdit(this.props.editOriginData);
  };

  render () {
    let { visible, onCancel } = this.props;
    const rowStyle = {
      margin: '0 0 1rem 0'
    };
    const labelStyle = {
      paddingTop: '.3rem'
    };
    const { chargeOfData, fetching } = this.state;
    let isEdit = this.props.type === AddItemModal.ModalType.EDIT;
    let { name, chargeOf, state, description } = this.props.editOriginData;
    return (<Modal title={ isEdit ? 'EDIT MACHINE' : 'ADD MACHINE' }
                   centered
                   visible={ visible }
                   onOk={ this.handleAddItem }
                   onCancel={ onCancel }
                   okText={ isEdit ? 'edit' : 'add' }
                   cancelText="cancel">
      <Row gutter={ 16 } style={ rowStyle }>
        <Col span={ 5 } style={ labelStyle }> Name: </Col>
        <Col span={ 19 }>
          <Input placeholder={ isEdit ? 'input new machine' : 'input machine name' }
                 value={ isEdit ? name : this.state.name }
                 onChange={ this.handleNameChange }/>
        </Col>
      </Row>
      <Row gutter={ 16 } style={ rowStyle }>
        <Col span={ 5 } style={ labelStyle }> State: </Col>
        <Col span={ 19 }>
          <Select value={ isEdit ? state : this.state.state }
                  style={ { width: '100%' } }
                  onChange={ this.handleStateChange }>
            { machineState.map(value => <Select.Option value={ value } key={ value }>{ value }</Select.Option>) }
          </Select>
        </Col>
      </Row>
      <Row gutter={ 16 } style={ rowStyle }>
        <Col span={ 5 } style={ labelStyle }> Charge of: </Col> <Col span={ 19 }>
        <Select style={ { width: '100%' } }
                placeholder={ 'select charge of' }
                showSearch
                showArrow={ false }
                value={ isEdit ? chargeOf : this.state.chargeOf }
                onChange={ this.handleChargeOfChange }
                onSearch={ this.handleSearch }
                filterOption={ false }
                notFoundContent={ fetching !== - 1 ? fetching ?
                  <Icon type="loading" spin style={ { color: Colors.theme.blue } }/> : <Empty/> : null }>
          { chargeOfData.map(v => (
            <Select.Option key={ v.id } value={ v.name + '.' + v.id }> { v.name + '.' + v.id } </Select.Option>)) }
        </Select>
      </Col>
      </Row>
      <label> Description: </label>
      <Input.TextArea autosize={ { minRows: 4, maxRows: 4 } }
                      placeholder={ isEdit ? description : 'input machine description...' }
                      value={ isEdit ? description : this.state.description }
                      onChange={ this.handleDescriptionChange }/>
    </Modal>);
  }
}

/*const mockData = [
  {
    id: '#MACHINE01',
    name: 'machine1',
    chargeOf: 'dpf',
    workTime: 20,
    idleTime: 2,
    maintainTime: 2,
    brokenTime: 3,
    runAt: '2018-11-04',
    currentState: 'idle'
  }
];*/

const StatisticDataBlock = ({ dataSource, lineChartData }) => {
  let statisticState = (dataSource || []).reduce((acc, cur) => {
    acc[cur.currentState] ? acc[cur.currentState] ++ : acc[cur.currentState] = 1;
    return acc;
  }, {});
  let pieChartDataSource = [];
  Object.keys(statisticState).forEach(k => pieChartDataSource.push({ name: k, value: statisticState[k] }));
  let isEmpty = dataSource.length === 0;
  return (<div className={ style.statisticData }>
    <h3>STATISTIC DATA</h3>
    { isEmpty ? <Loading text="loading..." height="30vh"/> :
      <ReactChart style={ { height: '40vh' } } option={ makePieChart(pieChartDataSource) }/> }
    <ReactChart style={ { height: '43vh' } } option={ option2 }/>
  </div>);
};
StatisticDataBlock.propTypes = {
  dataSource: PropTypes.array,
  lineChartData: PropTypes.array
};

const buttonStyle = {
  backgroundColor: '#E09EFF',
  borderColor: '#E09EFF'
};
export default class MachineManager extends Component {
  state = {
    searchMachine: '',
    modalVisible: false,
    dataSource: [],
    dataLoading: true,
    showCurrentState: 'all',
    modalType: AddItemModal.ModalType.ADD,
    editOriginData: {}
  };

  originDataSource = [];

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    queryMachine().then(data => {
      // just add color for every item
      let k = 0, j = 0, length = Colors.light.length;
      data = data.map((v) => {
        if (k >= length) k = 0;
        if (j >= Colors.custom.length) j = 0;
        return ({
          ...v,
          avatarColor: Colors.light[k ++],
          chargeOfColor: Colors.custom[j ++]
        });
      });

      this.originDataSource = [...data]; // origin data & can't reference data
      this.setState({ dataSource: data, dataLoading: false });
    });
  }

  editChange = {
    nameChange: name => {
      this.setState(state => ({ editOriginData: { ...state.editOriginData, name } }));
    },
    stateChange: currentState => {
      this.setState(state => ({ editOriginData: { ...state.editOriginData, state: currentState } }));
    },
    chargeOfChange: chargeOf => {
      this.setState(state => ({ editOriginData: { ...state.editOriginData, chargeOf } }));
    },
    descriptionChange: description => {
      this.setState(state => ({ editOriginData: { ...state.editOriginData, description } }));
    }
  };

  onAddItem = (machine) => {
    this.setState({ modalVisible: false, modalType: AddItemModal.ModalType.ADD });
    let loading = message.loading('waiting to add...', 1);
    createMachine(machine).then(res => {
      loading.then(() => {
        if (res.err) {
          message.error('you have an error on add machine!');
        } else {
          // just add color for every item
          res.machine = { ...res.machine, avatarColor: Colors.light[0], chargeOfColor: Colors.custom[0] };
          this.originDataSource.unshift(res.machine);
          this.setState(state => ({ dataSource: [res.machine, ...state.dataSource] }));
          message.success('success to add machine');
        }
      }, null);
    });
  };

  cancelAddItem = () => {
    this.setState({ modalVisible: false });
  };

  onDeleteItem = id => {
    console.log(id);
    let loading = message.loading('waiting to delete...', 1);
    deleteMachine(id).then(res => {
      loading.then(() => {
        if (res.err) {
          message.error('you have an error on delete machine!');
          console.log(res.msg);
        } else {
          message.success('success to delete machine!');
          this.originDataSource = this.originDataSource.filter(v => v.id !== id);
          this.setState(state => ({
            dataSource: state.dataSource.filter(v => v.id !== id)
          }));
        }
      }, null);
    });
  };

  onShowEdit = (machine) => {
    console.log(machine);
    this.setState({
      modalType: AddItemModal.ModalType.EDIT,
      modalVisible: true,
      editOriginData: machine
    });
  };

  onEditItem = (newMachine) => {
    this.setState({ modalVisible: false });
    const loading = message.loading('waiting to update machine...', 1);
    console.log(newMachine);
    let { id, state: currentState, ...machine } = newMachine;
    console.log(currentState, machine);
    modifyMachine(id, { state: currentState, ...machine }).then(res => {
      loading.then(() => {
        if (res.err) {
          message.error('you have error on update machine!');
        } else {
          this.setState(state => ({
            dataSource: state.dataSource.map(v => ({
              ...v, ...(v.id === id ? {
                ...machine,
                currentState
              } : null)
            }))
          }));
          message.success('success to update machine.');
        }
      }, null);

      console.log(res);
    });
  };

  sortItem = () => {
    this.setState(state => ({
      dataSource: state.dataSource.sort((a, b) => a.workTime - b.workTime)
    }));
  };

  filterItem = value => {
    this.setState({
      dataSource: value === 'all' ? this.originDataSource :
        this.originDataSource.filter(v => v.currentState === value),
      showCurrentState: value
    });
  };

  handleSearchMachine = name => {
    this.setState(state => ({
      dataSource: state.dataSource.filter(value => {
        return value.name.includes(name);
      })
    }));
  };

  render () {

    return (
      <div id="__page" className={ style.machineManager }>
        <Row>
          <Col span={ 13 }>
            <div className={ style.title }>
              <h3>MACHINE MANAGER</h3>
              <Tag style={ { marginLeft: '1rem' } } color="geekblue">total: { this.state.dataSource.length } </Tag>
              <div className={ style.toolBox }>
                <Button type="primary" size="small" style={ buttonStyle } onClick={ this.sortItem }>
                  <Icon type="arrow-up"/> sort
                </Button>
                <Button type="primary"
                        size="small"
                        style={ buttonStyle }
                        onClick={ () => this.setState({ modalVisible: true, modalType: 'add' }) }>
                  <Icon type="plus"/> add
                </Button>
                <Select style={ { width: '6rem' } }
                        size="small"
                        value={ this.state.showCurrentState }
                        onChange={ this.filterItem }>
                  <Select.Option value="all">all</Select.Option>
                  <Select.Option value="idle">idle</Select.Option>
                  <Select.Option value="work">work</Select.Option>
                  <Select.Option value="maintain">maintain</Select.Option>
                  <Select.Option value="broken">broken</Select.Option>
                </Select>
                <Search placeholder="Search machine"
                        style={ { width: '10rem' } }
                        onSearch={ this.handleSearchMachine }
                        size="small"/>
              </div>
            </div>
            {
              this.state.dataLoading ?
                <div>
                  <Skeleton active/>
                  <Skeleton active/>
                  <Skeleton active/>
                  <Skeleton active/>
                </div> : <List itemLayout="vertical"
                               pagination={ { pageSize: 4, simple: true, hideOnSinglePage: true } }
                               dataSource={ this.state.dataSource || [] }
                               renderItem={ item => <MachineListItem { ...item }
                                                                     onItemDelete={ this.onDeleteItem }
                                                                     onItemEdit={ this.onShowEdit }/> }/>
            }
          </Col>
          <Col span={ 11 }>
            <StatisticDataBlock dataSource={ this.state.dataSource }/>
          </Col>
        </Row>
        <AddItemModal visible={ this.state.modalVisible }
                      onAdd={ this.onAddItem }
                      onCancel={ this.cancelAddItem }
                      onEdit={ this.onEditItem }
                      editOriginData={ this.state.editOriginData }
                      editChange={ this.editChange }
                      type={ this.state.modalType }/>
      </div>
    );
  }
}