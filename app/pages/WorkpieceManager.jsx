import React, { Component } from 'react';
import {
  DatePicker,
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
  Statistic,
  Card,
  message,
  Popconfirm
} from 'antd';

import { queryWorkpiece } from '../graphql/query';
import { createWorkpiece, deleteWorkpiece, modifyWorkpiece } from '../graphql/mutation';
import * as PropTypes from 'prop-types';

import style from './Manager.less';
import '../app.global.css';
import { Loading } from '../components/Components';


class AddItemModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    onAdd: PropTypes.func,
    onCancel: PropTypes.func
  };
  state = {
    name: '',
    price: '',
    processTotalTime: '',
    deliveryDate: '',
    description: ''
  };

  constructor (props) {
    super(props);

  }

  handleAddItem = () => {
    let price            = Number.parseFloat(this.state.price),
        processTotalTime = Number.parseFloat(this.state.processTotalTime);
    this.props.onAdd({ ...this.state, price, processTotalTime });
  };


  render () {
    const rowStyle = {
      margin: '0 0 1rem 0'
    };
    const labelStyle = {
      paddingTop: '.3rem'
    };
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
          <Col span={ 5 } style={ labelStyle }>Price: </Col>
          <Col span={ 19 }>
            <Input placeholder="workpiece price"
                   value={ this.state.price }
                   onChange={ e => this.setState({ price: e.target.value }) }/>
          </Col>
        </Row>

        <Row gutter={ 16 } style={ rowStyle }>
          <Col span={ 5 }>Process time:</Col>
          <Col span={ 19 }>
            <Input placeholder="process time"
                   value={ this.state.processTotalTime }
                   onChange={ e => this.setState({ processTotalTime: e.target.value }) }/>
          </Col>
        </Row>
        <Row gutter={ 16 } style={ rowStyle }>
          <Col span={ 5 }>Delivery date:</Col>
          <Col span={ 19 }>
            <DatePicker placeholder="input delivery date"
                        onChange={ (date, dateString) => this.setState({ deliveryDate: dateString }) }
                        style={ { width: '100%' } }
            />
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

// const mockData = Array.from({ length: 20 }, () => ({
//   name: '#W-1001-1.func',
//   price: 10,
//   time: '20',
//   deliveryDate: '2011-22-11'
// }));

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
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '6rem',
      render (price) {
        return <span style={ { color: 'green' } }>
            $ { price } <Icon type="arrow-up" style={ { color: 'lime' } }/>
        </span>;
      }
    },
    {
      title: 'Process time',
      dataIndex: 'processTotalTime',
      key: 'processTotalTime',
      width: '7rem',
      render (processTime) {
        return <span style={ { color: 'red' } }>
         <Icon type="clock-circle"/> { processTime } h
        </span>;
      }
    },
    {
      title: 'Delivery date',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      width: '9rem',
      render (deliveryDate) {
        return <span>
          <Tag> { deliveryDate } </Tag> <Icon type="check-circle"/>
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
            <Icon type="edit"/>
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
          Workpiece ({ this.props.total })
        </h3>
        <div className={ style.buttonGroup }>
          <Input.Search placeholder="search workpiece"
                        style={ { width: '12rem' } }
                        value=""
                        key="ff"
                        onSearch={ this.props.onSearch }
          />
          <Button shape="circle"
                  type="primary"
                  onClick={ this.props.onAdd }
          >
            <Icon type="plus"/>
          </Button>
        </div>
      </div>
    );
  }
}

export default class WorkpieceManager extends Component {
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
    queryWorkpiece().then(dataSource => {
      dataSource = dataSource.map(v => ({ ...v, name: `${ v.id }.${ v.name }` }));
      this.setState({ dataSource, fetching: false });
    });
  }

  onAddItem = data => {
    console.log(data);
    const loading = message.loading('waiting to add workpiece...', 1);
    createWorkpiece(data).then(res => {
      loading.then(() => {
        if (res.err) {
          message.error('you have error on add workpiece!');
        } else {
          let id = res.workpiece.id;
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
    deleteWorkpiece(id).then(res => {
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
      <div id="__page" className={ style.workpieceManager }>
        <AddItemModal visible={ this.state.visible }
                      onAdd={ this.onAddItem }
                      onCancel={ this.onCancel }/>
        <Row gutter={ 16 }>
          <Col span={ 5 }>
            <h3>STATISTIC</h3>
            <Row gutter={ 20 }>
              <Col span={ 12 }>
                <Card>
                  <Statistic title="total price"
                             value={ 20 }/>
                </Card>
              </Col>
              <Col span={ 12 }>
                <Card>

                  <Statistic title="total price"
                             value={ 20 }/>
                </Card>
              </Col>
            </Row>
            <h3 style={ { marginTop: '1rem' } }>STEPS</h3>
            <Steps direction="vertical" current={ 0 } size="small">
              <Steps.Step title="create" description="create workpiece"/>
              <Steps.Step title="manager" description="manager workpiece"/>
              <Steps.Step title="delete" description="delete workpiece"/>
            </Steps>
          </Col>
          <Col span={ 19 }>
            <ToolBox onAdd={ () => this.setState({ visible: true }) }
                     onSearch={ v => console.log(v) }
                     total={ this.state.dataSource.length }/>
            {
              this.state.fetching ?
                <Loading text="loading workpiece..."/>
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