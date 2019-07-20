const machineState = [
  { name: 'idle', value: 4, color: '#9EFFF2' },
  { name: 'work', value: 20, color: '#BCBCFF' },
  { name: 'maintain', value: 3, color: '#E09EFF' },
  { name: 'broken', value: 4, color: '#F3B2FF' }
];
export const machineStateOption = {
  series: [
    {
      name: '',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center'
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: '16',
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: machineState.map((v, i) => ({
        name: v.name,
        value: v.value,
        itemStyle: {
          color: v.color
        }
      }))
    }
  ]
};

let machineWork = [
  ['state', 'idle', 'work', 'maintain', 'broken'],
  ['Machine1', 0, 100, 20, 3],
  ['Machine2', 3, 200, 10, 1],
  ['Machine3', 1, 111, 0, 0],
  ['Machine4', 0, 100, 20, 0]
];

export const machineWorkOption = {
  legend: {
    left: '50px'
  },
  dataset: {
    source: machineWork
  },
  grid: {
    show: false
  },
  xAxis: {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#878787'
      },
      symbol: ['none', 'arrow'],
      symbolSize: [5, 5]
    },
    axisTick: {
      show: false
    }
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: '#878787'
      },
      symbol: ['none', 'arrow'],
      symbolSize: [5, 5]
    },
    splitLine: {
      show: false
    },
    axisLabel: {
      formatter: '{value} h'
    },
    axisTick: {
      show: false
    }
  },
  series: machineState.map(v => ({ type: 'bar', itemStyle: { color: v.color } }))
};

let days = [
  'MON',
  'TUES',
  'WED',
  'THURS',
  'FIR',
  'SAT',
  'SUN'
];
let produceModuleData = [
  { name: 'module 1', color: '#9EFFF2', value: [8, 10, 8, 8, 8, 8, 8] },
  { name: 'module 2', color: '#BCBCFF', value: [9, 6, 5, 7, 7, 8, 8] },
  { name: 'module 3', color: '#E09EFF', value: [7, 9, 11, 12, 6, 11, 11] },
  { name: 'module 4', color: '#F3B2FF', value: [8, 9, 9, 9, 11, 12, 8] },
  { name: 'module 5', color: '#FFD3EA', value: [8, 6, 7, 6, 7, 8, 12] }
];
export const produceModuleOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: produceModuleData.map(v => v.name)
  },
  grid: {
    show: false
  },
  xAxis: [
    {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#878787'
        },
        symbol: ['none', 'arrow'],
        symbolSize: [5, 5]
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        formatter: '{value}'
      },
      axisTick: {
        show: false
      },
      boundaryGap: false,
      data: days
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#878787'
        },
        symbol: ['none', 'arrow'],
        symbolSize: [5, 5]
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        formatter: '{value}'
      },
      axisTick: {
        show: false
      }
    }
  ],
  series: produceModuleData.map(v => ({
    name: v.name,
    type: 'line',
    stack: 'total',
    areaStyle: {
      color: v.color,
      opacity: 0.5
    },
    itemStyle: {
      color: v.color
    },
    data: v.value
  }))
};
