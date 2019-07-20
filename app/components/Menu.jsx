import { merger } from '../utils/utils';
import style from './Menu.less';
import React, { Component } from 'react';
import { history } from '../store/configureStore';
import routers from '../constants/routers';
import * as PropTypes from 'prop-types';

const menuType = ['home', 'more', 'chart', 'report'];
const routeMap = {
  'home': routers.HOME,
  'more': routers.MANAGER,
  'chart': routers.CHART,
  'report': routers.REPORT
};

const MenuItem = ({ icon, type, curType, onClick, ...other }) => {
  return (<button className={ merger(style.menuItem, style[type], type === curType && style.active) }
                  onClick={ () => onClick(type) }
                  { ...other }
  >
    <i className={ icon }/>
    <div className={ style.rightBar }/>
  </button>);
};


export default class Menu extends Component {
  static propTypes = {
    isLogin: PropTypes.bool,
    other: PropTypes.array
  };

  constructor (props) {
    super(props);
    this.state = {
      curType: menuType[0]
    };
  }

  handleClick = (type) => {

    this.setState({ curType: type });
    history.push(routeMap[type]);

  };

  render () {
    let { isLogin, other } = this.props;
    return (<div className={ merger(style.menu, isLogin || style.hidden) } {...other}>
      { menuType.map(v => <MenuItem key={ v }
                                    icon={ `icon-${ v }` }
                                    type={ v }
                                    onClick={ this.handleClick }
                                    curType={ this.state.curType }/>)
      }
    </div>);
  }
}