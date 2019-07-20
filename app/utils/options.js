import { machineState } from '../constants/constants';
import Colors from '../constants/colors';
// [{name: 'idle', value: 12}]
export const makePieChart = data => {
  data = data.map((v, i) => ({
    ...v,
    itemStyle: {
      color: Colors.light[i]
    }
  }));
  return {
    title: {
      text: 'MACHINE STATE DISTRIBUTION',
      x: 'left',
      textStyle: {
        fontSize: '.8rem',
        color: 'gray'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter (params) {
        return `${ params.name }: ${ params.value }`;
      }
    },
    legend: {
      right: 20,
      bottom: '50%',
      orient: 'vertical',
      data: machineState,
      textStyle: {
        color: 'gray'
      }
    },
    series: [
      {
        type: 'pie',
        radius: '55%',
        center: ['35%', '50%'],
        label: {
          show: true,
          formatter (params) {
            return params.percent + '%';
          }
        },
        data,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.1)'
          }
        }
      }
    ]
  };
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

export const option2 = {
  title: {
    text: 'MACHINE WORK TIME',
    x: 'left',
    textStyle: {
      fontSize: '.8rem',
      color: 'gray'
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: machineState,
    textStyle: {
      color: 'gray'
    },
    right: 10
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: days,
    axisLine: {
      symbol: ['none', 'arrow'],
      symbolSize: [5, 10],
      lineStyle: {
        color: 'gray'
      }
    },
    splitLine: {
      show: true
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value} h'
    },
    axisLine: {
      symbol: ['none', 'arrow'],
      symbolSize: [5, 10],
      lineStyle: {
        color: 'gray'
      }
    }
  },
  series: [
    {
      name: 'idle',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210],
      smooth: true,
      itemStyle: {
        color: '#9EFFF2'
      }
    },
    {
      name: 'work',
      type: 'line',
      data: [220, 182, 191, 234, 290, 330, 310],
      smooth: true,
      itemStyle: {
        color: '#BCBCFF'
      }
    },
    {
      name: 'maintain',
      type: 'line',
      data: [150, 232, 201, 154, 190, 330, 410],
      smooth: true,
      itemStyle: {
        color: '#E09EFF'
      }
    },
    {
      name: 'broken',
      type: 'line',
      data: [320, 332, 301, 334, 390, 330, 320],
      smooth: true,
      itemStyle: {
        color: '#F3B2FF'
      }
    }
  ]
};
