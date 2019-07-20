import React, { Component } from 'react';
import { Avatar, Button, Icon, Statistic, Tag, Popconfirm, Popover } from 'antd';
import * as PropTypes from 'prop-types';
import Colors from '../constants/colors';

import style from './MachineListItem.less';

const { random, floor } = Math;

const state = {
  idle: 'blue',
  work: 'green',
  maintain: 'gold',
  broken: 'red'
};

export default class MachineListItem extends Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    chargeOf: PropTypes.string,
    workTime: PropTypes.number,
    idleTime: PropTypes.number,
    maintainTime: PropTypes.number,
    brokenTime: PropTypes.number,
    runAt: PropTypes.string,
    currentState: PropTypes.string,
    onItemDelete: PropTypes.func,
    description: PropTypes.string,
    avatarColor: PropTypes.string,
    chargeOfColor: PropTypes.string,
    onItemEdit: PropTypes.func
  };

  constructor (props) {
    super(props);

  }

  handleItemDelete = () => {
    this.props.onItemDelete(this.props.id);
  };

  handleItemModify = () => {
    let { id, name, chargeOf, description, currentState } = this.props;
    console.log(id, name);
    this.props.onItemEdit({ id, name, chargeOf, description, state: currentState });
  };

  render () {
    const {
            id,
            name,
            chargeOf,
            workTime,
            idleTime,
            brokenTime,
            maintainTime,
            runAt,
            currentState,
            avatarColor,
            chargeOfColor
          } = this.props;

    return (<div className={ style.machineItem }>
      <div className={ style.leftBorder }
           style={ { background: `linear-gradient(to bottom, white, ${ avatarColor },white)` } }/>
      <div className={ style.title }>
        <h3>{ id }.{ name }</h3>
        <Tag color={ state[currentState] } style={ { float: 'right' } }>{ currentState }</Tag>
      </div>
      <div className={ style.middle }>
        <div className={ style.some }>
          <Avatar size={ 64 } shape="circle"
                  style={ { backgroundColor: avatarColor } }>
            { name.toUpperCase()[0] }
          </Avatar>
          <Statistic title="in charge of"
                     value={ chargeOf }
                     style={ { marginLeft: '1rem' } }
                     valueStyle={ { color: chargeOfColor } }
          />
        </div>
        <div className={ style.time }>
          <Statistic title="Work Time"
                     value={ workTime }
                     valueStyle={ { color: 'deepskyblue' } }
                     prefix={ <Icon type="arrow-up"/> }
                     suffix="h"/>
          <div>
            <h3>
              <Icon type="clock-circle" style={ { color: 'limegreen' } }/> Idle:
              <em style={ { color: 'limegreen' } }>{ idleTime }h</em>
            </h3>
            <h3>
              <Icon type="tool" style={ { color: '#E09EFF' } }/> Maintain:
              <em style={ { color: '#E09EFF' } }>{ maintainTime }h</em>
            </h3>
            <h3>
              <Icon type="warning" style={ { color: 'red' } }/> Broken:
              <em style={ { color: 'red' } }>{ brokenTime }h</em>
            </h3>
          </div>
        </div>
      </div>
      <div className={ style.footer }>
        <h4>run at <em>{ runAt }</em></h4>
        <Button.Group style={ { float: 'right' } }>
          <Button size="small" style={ { border: 'none' } } onClick={ this.handleItemModify }>
            <Icon type="edit"/></Button>
          <Popover title="description" content={ <span>{ this.props.description }</span> } trigger="click">
            <Button size="small" style={ { border: 'none' } }><Icon type="dash"/></Button>
          </Popover>
          <Popconfirm title={ `Are you sure delete ${ id }.${ name }?` }
                      okText="Yes"
                      cancelText="No"
                      onConfirm={ this.handleItemDelete }>
            <Button size="small" style={ { border: 'none' } }><Icon type="delete"/></Button>
          </Popconfirm>
        </Button.Group>
      </div>
    </div>);
  }
}