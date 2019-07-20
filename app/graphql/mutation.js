import { graphql } from './graphql';

export const createMachine = (machine) => graphql.mutation({
  mutation: `mutation CreateMachine($machine: InputMachine!) {
              result: createMachine(machine: $machine) {
                err
                msg
                ... on MachineResponseType {
                  machine {
                    id
                    name
                    cost
                    idleTime
                    workTime
                    runAt
                    chargeOf
                    brokenTime
                    description
                    currentState
                    maintainTime
                  }
                }
              }
            }`,
  variables: { machine }
}).then(({ data: { result } }) => result);


export const deleteMachine = id => graphql.mutation({
  mutation: `mutation DeleteMachine($id: String!){
              result: deleteMachine(id: $id) {
                err
              }
            }`,
  variables: { id }
}).then(({ data: { result } }) => result);

export const modifyMachine = (id, machine) => graphql.mutation({
  mutation: `mutation ModifyMachine($id: String!, $machine: InputMachine!){
              result: modifyMachine(id:$id, machine: $machine) {
                err
                msg
                ... on MachineResponseType {
                  machine {
                    id
                    name
                    cost
                    idleTime
                    workTime
                    runAt
                    chargeOf
                    brokenTime
                    description
                    currentState
                    maintainTime
                  }
                }
              }
            }`,
  variables: { id, machine }
}).then(({ data: { result } }) => result);

export const createWorkpiece = workpiece => graphql.mutation({
  mutation: `mutation CreateWorkpiece($workpiece: InputWorkpiece!){
              result: createWorkpiece(workpiece: $workpiece) {
                err
                msg
                ... on WorkpieceResponseType {
                   workpiece {
                    id
                  }
                }
              }
            }`,
  variables: { workpiece }
}).then(({ data: { result } }) => result);


export const modifyWorkpiece = (id, workpiece) => graphql.mutation({
  mutation: `mutation ModifyWorkpiece($id: String!, $workpiece: InputWorkpiece!) {
              result: modifyWorkpiece (id: $id, workpiece: $workpiece) {
                err
                msg
              }
            }`,
  variables: { id, workpiece }
}).then(({ data: { result } }) => result);

export const deleteWorkpiece = id => graphql.mutation({
  mutation: `mutation DeleteWorkpiece($id: String!) {
              result: deleteWorkpiece(id: $id) {
                err
                msg
              }
            }`,
  variables: { id }
}).then(({ data: { result } }) => result);

export const createProcess = process => graphql.mutation({
  mutation: `mutation createProcess($process: InputProcess!) {
              result: createProcess(process: $process) {
                err
                msg
                ... on ProcessResponseType {
                  process {
                    id
                    name
                  }
                }
              }
            }`,
  variables: { process }
}).then(({ data: { result } }) => result);

export const modifyProcess = (id, process) => graphql.mutation({
  mutation: `mutation ModifyProcess($id: String!, $process: InputProcess!) {
              result: modifyProcess(id: $id, process: $process) {
                err
                msg
              }
            }`,
  variables: { id, process }
}).then(({ data: { result } }) => result);

export const deleteProcess = id => graphql.mutation({
  mutation: `mutation DeleteProcess($id: String!) {
              result: deleteProcess(id: $id) {
                err
                msg
              }
            }`,
  variables: { id }
}).then(({ data: { result } }) => result);

export const useSchedule = parameter => graphql.mutation({
  mutation: `mutation UseSchedule($parameter: InputScheduledParameter!) {
              result: useSchedule(param: $parameter) {
                fulfillTime
                result {
                  workpiece
                  process
                  machine
                  startTime
                  endTime
                }
              }
            }`,
  variables: { parameter }
}).then(({ data: { result } }) => result);
