import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { merger } from '../utils/utils';
import style from './Avatar.less';
import { connect } from 'react-redux';
import defaultAvatar from '../icons/avatar.png';

class Avatar extends Component {
  static propTypes = {
    src: PropTypes.string,
    count: PropTypes.number,
    onClick: PropTypes.func,
    isLogin: PropTypes.bool,
    other: PropTypes.array
  };

  static defaultProps = {
    src: '',
    count: - 1,
    onClick: null
  };

  constructor (props) {
    super(props);
  }

  render () {
    const { src, count, onClick } = this.props;
    let has = !!src;
    return (<div className={ merger(style.avatar, this.props.isLogin || style.large) }
                 onClick={ onClick }
                 { ...this.props.other }
    >
      { count !== - 1 ? <span className={ style.badge }>{ count }</span> : <span/> }
      <div className={ style.image }>
        <img src={ has ? src : defaultAvatar } alt/>
      </div>
    </div>);
  }
}

export default connect(
  ({ reducer: { isLogin } }) => ({ isLogin })
)(Avatar);