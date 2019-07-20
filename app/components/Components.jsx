import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import style from './Components.less';
import { Icon, Spin } from 'antd';
import Colors from '../constants/colors';
import bitMES from '../icons/bit.mes.png';
import { merger } from '../utils/utils';

export class Progress extends Component {
  static propTypes = {
    title: PropTypes.string,
    color: PropTypes.string,
    value: PropTypes.number,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    other: PropTypes.array
  };
  static defaultProps = {
    color: '#E09EFF',
    value: 0,
    height: '.7rem'
  };


  constructor (props) {
    super(props);
  }

  render () {
    const { title, color, value, height, other } = this.props;
    let width = Math.floor(value * 0.65);
    return (
      <div className={ style.progress } style={ { height } } { ...other }>
        <span>{ title }</span>
        <span style={ { background: color, width: `${ width }%` } }/>
        <span>{ value }%</span>
      </div>
    );
  }
}

export const Loading = ({ text, height = '50vh' }) => <Spin
  style={ { height, width: '100%', color: 'gray', textAlign: 'center', marginTop: '10vh' } }
  size="large"
  indicator={ <Icon type="loading" spin style={ { color: Colors.theme.purple, fontSize: '2.5rem' } }/> }
  tip={ text }/>;

export const LoadingPage = ({ loading }) => <div className={ merger(style.loadingPage, loading || style.hidden) }>
  <div className={ style.context }>
    <img src={ bitMES } alt/>
    <h3 className={ style.loadingBar }>
      Bit.MES
    </h3>
    <div className={ style.loadingBar }>
      <Icon type="loading" spin/>
    </div>
  </div>
  <div className={ style.footer }>
    <h4>design by dengpengfei</h4>
  </div>
</div>;