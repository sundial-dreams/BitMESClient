import React, { Component, useState } from 'react';
import style from './AppMenu.less';
import { Icon, Button } from 'antd';
import Avatar from '../components/Avatar';
import Login from '../components/Login';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import { login } from '../actions/action';
import Menu from './Menu';


const Helper = props => <div className={ style.helper }>
  <Icon type="setting" style={ { fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.3)' } }/>
</div>;


class AppMenu extends Component {
  static propTypes = {
    isLogin: PropTypes.bool,
    login: PropTypes.func,
    width: PropTypes.string,
    other: PropTypes.array
  };
  static defaultProps = {
    width: '4rem'
  };
  state = {
    avatarSrc: ''
  };

  constructor (props) {
    super(props);

  }

  handleSetAvatarSrc = src => {
    this.setState({
      avatarSrc: src
    });
  };

  handleLogin = (email) => {
    this.props.login(email, this.state.avatarSrc);
  };

  render () {
    const { width, isLogin } = this.props;
    return (
      <div className={ style.appMenu } style={ { width } } { ...this.props.other }>
        <Avatar src={ this.state.avatarSrc }/>
        <Login onLogin={ this.handleLogin }
               onSetAvatarSrc={ this.handleSetAvatarSrc }
               isLogin={ isLogin }
        />
        <Menu isLogin={ isLogin }/>
        <Helper/>
      </div>
    );
  }
}

export default connect(
  ({ reducer: { isLogin } }) => ({ isLogin }),
  (dispatch) => ({
    login: (email, avatar) => dispatch(login(email, avatar))
  })
)(AppMenu);