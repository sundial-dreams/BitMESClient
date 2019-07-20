import React, { Component, useState } from "react";
import style from "./TitleBar.less";
import { ipcRenderer } from "electron";
import { merger } from "../utils/utils";

const MaximizeButton = props => {
  const [state, setState] = useState({ isMaximize: false });
  return (<button className={ merger(style.maximizeButton, state.isMaximize && style.maximized) } onClick={ () => {
    ipcRenderer.send("maximize");
    setState({ isMaximize: !state.isMaximize });
  } }>
    <div />
    <div />
  </button>);
};

const DragArea = props => (<div className={ style.dragArea }/>);

const ClosedButton = props => {
  return (<button className={ style.closedButton } onClick={() => {
    ipcRenderer.send("close")
  } }>
    <div/>
    <div/>
  </button>)
};
const MinimizedButton = props => {
  return (<button className={ style.minimizedButton } onClick={() => {
    ipcRenderer.send("minimize");
  } }>
<div />
  </button>)
};


export default class TitleBar extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (<div className={ style["title-bar"] }>
      <DragArea/>
      <div className={style.buttonGroup}>
        <MinimizedButton/>
        <MaximizeButton/>
        <ClosedButton/>
      </div>
    </div>)
  }
}


