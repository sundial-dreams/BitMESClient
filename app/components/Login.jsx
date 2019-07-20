import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import { debounce, throttle, merger } from '../utils/utils';
import * as PropTypes from 'prop-types';
import { verifyPassword, verifyEmail } from '../graphql/query';

import style from './Login.less';

const okIcon = <Icon type="check" style={ { color: 'lime' } }/>;
const errIcon = <Icon type="close" style={ { color: 'red' } }/>;
const loadingIcon = <Icon type="loading" style={ { color: '#9EFFF2' } }/>;
const buttonStyle = {
  width: '100%',
  borderRadius: '2px',
  backgroundColor: '#BB86D7',
  borderColor: '#BB86D7'
};

export default class Login extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    onSetAvatarSrc: PropTypes.func.isRequired,
    isLogin: PropTypes.bool,
    other: PropTypes.array
  };
  state = {
    email: '',
    checkEmailIcon: null,
    password: '',
    checkPasswordIcon: null
  };

  constructor (props) {
    super(props);
  }

  checkEmail = debounce((email) => {
    /*fetch('http://localhost:9000/login/username', {
      method: 'POST',
      body: JSON.stringify({ email })
    }).then(res => res.json())
      .then(({ err, src }) => {
        this.setState({ checkEmailIcon: err ? errIcon : okIcon });
        this.props.onSetAvatarSrc(err ? '' : src);
      });*/
    verifyEmail(email).then(({ data: { result } }) => {
      let { err, avatar } = result;
      this.setState({ checkEmailIcon: err ? errIcon : okIcon });
      this.props.onSetAvatarSrc(err ? '' : avatar);
    });
  });

  checkPassword = debounce((email, password) => {
  /*  fetch('http://localhost:9000/login/password', {
      method: 'POST',
      body: JSON.stringify({ password })
    }).then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ checkPasswordIcon: data.err ? errIcon : okIcon });
      });*/
    verifyPassword(email, password).then(({ data: { result } }) => {
      let { err } = result;
      this.setState({ checkPasswordIcon: err ? errIcon : okIcon });
    });
  });

  handleEmailChange = e => {
    let email = e.target.value;
    this.setState({ email: email, checkEmailIcon: !!email && loadingIcon });
    !!email && this.checkEmail(email);
  };

  handlePasswordChange = e => {
    let password = e.target.value;
    this.setState({ password, checkPasswordIcon: !!password && loadingIcon });
    !!password && this.checkPassword(this.state.email, password);
  };

  handleLogin = () => {
    this.props.onLogin(this.state.email, this.state.password);
  };

  render () {
    let ok = this.state.checkEmailIcon === okIcon && this.state.checkPasswordIcon === okIcon;
    let { isLogin, other } = this.props;
    return (
      <div className={ merger(style.login, isLogin && style.hidden) } {...other}>
        <h3>LOGIN</h3>
        <div>
          <input type="text" placeholder="email"
                 onChange={ this.handleEmailChange }/>
          <span>{ this.state.checkEmailIcon }</span>
        </div>
        <div>
          <input type="password" placeholder="password"
                 onChange={ this.handlePasswordChange }/>
          <span>{ this.state.checkPasswordIcon }</span>
        </div>
        <Button type="primary" style={ buttonStyle } disabled={ !ok } onClick={ this.handleLogin }>
          Login
        </Button>
      </div>
    );
  }
}