import React, { Component } from 'react';
import { Icon, Button } from 'antd';
import { merger } from '../utils/utils';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import { logout } from '../actions/action';
import style from './ToolBox.less';


const makeButtonStyle = color => ({
  backgroundColor: color,
  borderColor: color
});

class ToolBox extends Component {
  static propTypes = {
    isLogin: PropTypes.bool,
    logout: PropTypes.func,
    other: PropTypes.array
  };

  constructor (props) {
    super(props);
    this.state = {
      isActive: false,
      hidden: false
    };
  }


  render () {
    let { isLogin, other } = this.props;
    return (<div
        className={ merger(style.toolButton,
          this.state.isActive && style.active,
          isLogin || style.hidden,
          this.state.hidden && style.hidden) }
        onClick={ this.state.isActive ? null : () => this.setState({ isActive: true }) }
        { ...other }>
        <div className={ style.bg }>
          <span/>
          <span/>
        </div>
        <div className={ style.tool }>
          <h3>
            MENU
            <Button shape="circle-outline" type="default" size="small"
                    style={ { float: 'right', borderColor: 'transparent' } }
                    onClick={ () => this.setState({ isActive: false }) }>
              <Icon type="close"/>
            </Button>
          </h3>
          <div className={ style.button }>
            <Button type="primary" shape="circle" size="large" style={ makeButtonStyle('#9EFFF2') }>
              <Icon type="reload"/>
            </Button>
            <Button type="primary" shape="circle" size="large" style={ makeButtonStyle('#BCBCFF') }>
              <Icon type="message"/>
            </Button>
            <Button type="primary"
                    shape="circle"
                    size="large"
                    style={ makeButtonStyle('#E09EFF') }
                    onClick={ () => this.setState({ hidden: true }) }>
              <Icon type="eye-invisible"/>
            </Button>
            <Button type="primary" shape="circle" size="large" style={ makeButtonStyle('#F3B2FF') }
                    onClick={ this.props.logout }>
              <Icon type="logout"/>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ reducer: { isLogin } }) => ({ isLogin }),
  (dispatch) => ({ logout: () => dispatch(logout()) })
)(ToolBox);