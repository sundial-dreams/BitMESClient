const devHost = 'http://localhost:9000/graphql';
const productHost = 'http://codejs.net.cn:9000/graphql';

export default class GraphQL {
  constructor ({ endpoint }) {
    this.endpoint = endpoint;
  }

  _graphqlFetch ({ body }) {
    return fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body
    }).then(res => res.json());
  }

  query ({ query, variables = {}, fragment }) {
    fragment && (query += '\n' + fragment);
    return this._graphqlFetch({ body: JSON.stringify({ query, variables }) });
  }

  mutation ({ mutation, variables = {}, fragment }) {
    fragment && (mutation += '\n' + fragment);
    return this._graphqlFetch({ body: JSON.stringify({ query: mutation, variables }) });
  }
}

export const graphql = new GraphQL({ endpoint: productHost });
