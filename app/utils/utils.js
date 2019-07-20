export const merger = (...args) => args.join(' ');

export const debounce = (fn, t = 500) => {
  let timeout = null;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.call(this, ...args), t);
  };
};

export const throttle = (fn, t = 500) => {
  let canRun = true;
  return function(...args) {
    console.log(canRun);
    if (!canRun) return;
    canRun = false;
    setTimeout(() => {
      fn.call(this, ...args);
      canRun = true;
    }, t);
  };
};

export const filterAttribute = (object, ...attr) => {
  let result = {};
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      if (attr.indexOf(key) === - 1) {
        result[key] = object[key];
      }
    }
  }
  return result;
};

// let mock = [
//   {
//     beforeProcess: '#P-5852-27',
//     chargeOf: '#S-1010-1',
//     description: 'inspect screen',
//     id: '#P-3959-28',
//     machine: '#M-2304-14',
//     name: '#P-3959-28.inspect',
//     time: 5,
//     workpiece: '#W-5829-8'
//   },
//   {
//     beforeProcess: '#P-7792-26',
//     chargeOf: '#S-1010-1',
//     description: 'build up screen',
//     id: '#P-5852-27',
//     machine: '#M-671-13',
//     name: '#P-5852-27.build up',
//     time: 11,
//     workpiece: '#W-5829-8'
//   },
//   {
//     beforeProcess: 'Self',
//     chargeOf: '#S-1111-3',
//     description: 'produce battery',
//     id: '#P-6810-29',
//     machine: '#M-671-13',
//     name: '#P-6810-29.produce',
//     time: 5,
//     workpiece: '#W-554-9'
//   },
//   {
//     beforeProcess: '#P-6810-29',
//     chargeOf: '#S-1111-3',
//     description: 'inspect battery',
//     id: '#P-8883-30',
//     machine: '#M-3836-15',
//     name: '#P-8883-30.inspect',
//     time: 10,
//     workpiece: '#W-554-9'
//   }
// ];
//
// let process = [
//   { id: '#P-8883-30', beforeProcess: '#P-6810-29', workpiece: '#W-554-9', time: 10, machine: '#M-3836-15' },
//   { id: '#P-6810-29', beforeProcess: 'Self', workpiece: '#W-554-9', time: 5, machine: '#M-671-13' }
// ];
//
// let temp = {
//   '#W-554-9': { // 工件编号
//     '#P-8883-30': { machine: '#M-3836-15', time: 10, order: 1 }, // 工序编号，order表示第几道工序
//     '#P-6810-29': { machine: '#M-671-13', time: 5, order: 0 }
//   }
// };
//
// let result = [
//   { workpiece: '#W-554-9', machine: '#M-3836-15', process: '#P-8883-30', time: 10, order: 1 },
//   { workpiece: '#W-554-9', machine: '#M-671-13', process: '#P-6810-29', time: 5, order: 0 }
// ];

const makeArray = data => {
  let result = [];
  Object.keys(data).forEach(workpiece => {
    Object.keys(data[workpiece]).forEach(process => {
      result.push({ workpiece, process, ...data[workpiece][process] });
    });
  });
  return result;
};
const { keys } = Object;
const { max } = Math;
export const reshapeData = (dataSource) => {
  let result = {};
  let processSet = new Set(dataSource.map(v => v.id));
  dataSource.forEach(data => {
    let { workpiece, id: process, machine, time, beforeProcess: order } = data;
    if (order === 'Self' || !processSet.has(order)) order = 0;
    result[workpiece] ? result[workpiece][process] = { machine, time, order } : result[workpiece] = {
      [process]: { machine, time, order }
    };
  });
  /**
   * data = {
   *   b: {before: a},
   *   a: {before: self},
   *   c: {before: b}
   * }
   * reverse_data = {
   *   1: b,
   *   0: a,
   *   b: c
   * }
   */
  // result[k][reverseIndex[reverseIndex[0]]].order = 1;
  keys(result).forEach(workpiece => {
    let reverseIndex = {};
    let processNumber = Object.keys(result[workpiece]).length;
    keys(result[workpiece]).forEach(process => {
      let order = result[workpiece][process].order;
      reverseIndex[order] = process;
    });
    let currentOrder = 1;
    while (currentOrder < processNumber) {
      let object = result[workpiece][reverseIndex[reverseIndex[currentOrder - 1]]];
      result[workpiece][reverseIndex[reverseIndex[currentOrder - 1]]].order = currentOrder;
      reverseIndex[currentOrder] = reverseIndex[reverseIndex[currentOrder - 1]];
      currentOrder ++;
    }
  });

  return makeArray(result);
};

