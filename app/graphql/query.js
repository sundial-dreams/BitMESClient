import { graphql } from './graphql';

export const verifyEmail = email => graphql.query({
  query: `query VerifyEmail($email: String!) {
            result: verifyEmail(email: $email) {
              err
              msg
              ... on UserResponseType {
                avatar
              }
            }
          }`,
  variables: { email }
});

export const verifyPassword = (email, password) => graphql.query({
  query: `query VerifyPassword($email: String!, $password: String!) {
            result: verifyPassword(email: $email, password: $password) {
              err
              msg
            }
          }`,
  variables: { email, password }
});

export const queryMachine = () => graphql.query({
  query: `query {
            result: queryMachine {
              id
              name
              description
              chargeOf
              workTime
              idleTime
              maintainTime
              brokenTime
              cost
              currentState
              runAt
            }
          }`
}).then(({ data: { result } }) => result);

export const queryStaffByName = name => graphql.query({
  query: `query QueryStaffByName($name: String!){
            result: queryStaffByName(name: $name) {
              id
              name
            }
          }`,
  variables: { name }
}).then(({ data: { result } }) => result);

export const queryMachineByName = name => graphql.query({
  query: `query QueryMachineByName($name: String!){
            result: queryMachineByName(name: $name) {
              id
              name
            }
          }`,
  variables: { name }
}).then(({ data: { result } }) => result);

export const queryWorkpieceByName = name => graphql.query({
  query: `query QueryWorkPieceByName($name: String!){
            result: queryWorkPieceByName(name: $name) {
              id
              name
            }
          }`,
  variables: { name }
}).then(({ data: { result } }) => result);

export const queryWorkpiece = () => graphql.query({
  query: `query {
            result: queryWorkpiece {
              id
              name
              price
              processTotalTime
              description
              deliveryDate
            }
          }`
}).then(({ data: { result } }) => result);

export const queryProcess = () => graphql.query({
  query: `query {
            result: queryProcess {
              id
              name
              workpiece
              description
              time
              chargeOf
              machine
              beforeProcess
            }
          }`
}).then(({ data: { result } }) => result);

export const queryProcessByName = name => graphql.query({
  query: `query QueryProcessByName($name: String!){
            result: queryProcessByName(name: $name) {
              id
              name
            }
          }`,
  variables: { name }
}).then(({ data: { result } }) => result);


export const queryScheduleHistory = () => graphql.query({
  query: `query {
            result: queryScheduleHistory {
              id
              time
            }
          }`
}).then(({ data: { result } }) => result);

export const queryScheduleResult = (id = null) => graphql.query({
  query: `query QueryScheduleResult($id: String!){
            result: queryScheduleResult(id: $id) {
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
  variables: { id }
}).then(({ data: { result } }) => result);
