import echarts from 'echarts';
import Colors from '../constants/colors';

// export const mockData = [
//   { workpiece: 0, process: 0, machine: 0, startTime: 2, endTime: 5 },
//   { workpiece: 0, process: 1, machine: 1, startTime: 5, endTime: 7 },
//   { workpiece: 0, process: 2, machine: 2, startTime: 7, endTime: 9 },
//   { workpiece: 1, process: 0, machine: 0, startTime: 0, endTime: 2 },
//   { workpiece: 1, process: 1, machine: 2, startTime: 2, endTime: 3 },
//   { workpiece: 1, process: 2, machine: 1, startTime: 7, endTime: 11 },
//   { workpiece: 2, process: 0, machine: 1, startTime: 0, endTime: 4 },
//   { workpiece: 2, process: 1, machine: 2, startTime: 4, endTime: 7 }
// ];

export const Mode = {
  MACHINE: 'machine',
  WORKPIECE: 'workpiece'
};

function renderItem (params, api) {
  let categoryIndex = api.value(0);
  let start = api.coord([api.value(1), categoryIndex]);
  let end = api.coord([api.value(2), categoryIndex]);
  let height = api.size([0, 1])[1] * 0.6;

  let rectShape = echarts['graphic'].clipRectByRect({
    x: start[0],
    y: start[1] - height / 2,
    width: end[0] - start[0],
    height: height
  }, {
    x: params.coordSys.x,
    y: params.coordSys.y,
    width: params.coordSys.width,
    height: params.coordSys.height
  });

  return rectShape && {
    type: 'rect',
    shape: rectShape,
    style: api.style()
  };
}

const { keys } = Object;
export const makeGanttChartOption = ({ dataSource, mode = Mode.MACHINE, showGrid = false }) => {
  let data = [];

  let machines = dataSource.reduce((acc, cur) => {
    acc[cur.machine] ? acc[cur.machine].push(cur) : acc[cur.machine] = [cur];
    return acc;
  }, {});

  let workpieces = dataSource.reduce((acc, cur) => {
    acc[cur.workpiece] ? acc[cur.workpiece].push(cur) : acc[cur.workpiece] = [cur];
    return acc;
  }, {});

  let isByMachine = mode === Mode.MACHINE;
  let isByWorkpiece = mode === Mode.WORKPIECE;

  let machineColors = {};
  let workpieceColors = {};
  keys(workpieces).forEach((v, i) => workpieceColors[v] = Colors.light[i]);
  keys(machines).forEach((v, i) => machineColors[v] = Colors.light[i]);

  isByMachine && keys(machines).forEach((k) => {
    machines[k].forEach(v => {
      let duration = v.endTime - v.startTime;
      data.push({
        name: v.workpiece,
        value: [k, v.startTime, v.endTime, duration],
        itemStyle: {
          normal: {
            color: workpieceColors[v.workpiece]
          }
        }
      });
    });
  });

  isByWorkpiece && keys(workpieces).forEach(k => {
    workpieces[k].forEach(v => {
      let duration = v.endTime - v.startTime;
      data.push({
        name: v.machine,
        value: [k, v.startTime, v.endTime, duration],
        itemStyle: {
          normal: {
            color: machineColors[v.machine]
          }
        }
      });
    });
  });

  return {
    tooltip: {
      formatter: function(params) {
        return params.marker + params.name + ': ' + params.value[3] + ' h';
      }
    },
    dataZoom: [{
      type: 'slider',
      top: 60,
      height: 3,
      filterMode: 'weakFilter',
      textStyle: {
        color: 'gray'
      }

    },
      {
        type: 'inside',
        filterMode: 'weakFilter'
      },
      {
        type: 'slider',
        yAxisIndex: 0,
        zoomLock: true,
        width: 3,
        left: '10%',
        handleSize: 0,
        showDetail: false,
        filterMode: 'weakFilter',
        textStyle: {
          color: 'gray'
        }
      },
      {
        type: 'inside',
        id: 'insideY',
        yAxisIndex: 0,
        filterMode: 'weakFilter',
        zoomOnMouseWheel: true,
        moveOnMouseMove: true,
        moveOnMouseWheel: true
      }
    ],
    xAxis: {
      min: 0,
      scale: true,
      position: 'top',
      name: 'h',
      axisLine: {
        lineStyle: {
          color: 'gray'
        },
        symbol: ['none', 'arrow'],
        symbolSize: [5, 5],
        show: false
      },
      axisTick: {
        length: 3,
        lineStyle: {
          color: '#BB86D7',
          width: 1
        }
      },
      interval: 2,
      axisLabel: {
        formatter: function(val) {
          return Math.max(0, val);
        },
        color: 'gray'
      },
      splitLine: {
        show: showGrid
      }
    },
    yAxis: {
      data: keys(isByMachine ? machines : workpieces),
      axisTick: {
        length: 3,
        lineStyle: {
          color: '#BB86D7',
          width: 1
        }
      },
      splitLine: {
        show: showGrid
      },
      axisLabel: {
        formatter: (v, i) => {
          return v;
        },
        color: 'white',
        padding: [6, 6, 6, 6],
        backgroundColor: '#BB86D7',
        fontSize: '.7rem'
      },
      axisLine: {
        show: false
      }
    },

    series: [{
      type: 'custom',
      renderItem,
      itemStyle: {
        normal: {
          opacity: 0.8
        }
      },
      encode: {
        x: [1, 2],
        y: 0
      },
      data: data
    }]
  };
};