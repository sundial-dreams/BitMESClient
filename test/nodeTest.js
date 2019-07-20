let mock = [
  { job: 0, process: 0, machine: 0, startTime: 0, endTime: 3 },
  { job: 0, process: 1, machine: 1, startTime: 4, endTime: 6 },
  { job: 0, process: 2, machine: 2, startTime: 9, endTime: 11 },
  { job: 1, process: 0, machine: 0, startTime: 3, endTime: 5 },
  { job: 1, process: 1, machine: 2, startTime: 5, endTime: 6 },
  { job: 1, process: 2, machine: 1, startTime: 6, endTime: 10 },
  { job: 2, process: 0, machine: 1, startTime: 0, endTime: 4 },
  { job: 2, process: 1, machine: 2, startTime: 6, endTime: 9 },
];
let test = mock.reduce((acc, cur) => {
  acc[cur.machine] ? acc[cur.machine].push(cur) : acc[cur.machine] = [cur];
  acc.length = Math.max(acc.length, cur.machine + 1);
  return acc;
}, { length: 0 });
test = Array.from(test);
console.log(test);
