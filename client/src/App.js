import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { ApolloProvider, graphql } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';


import gql from 'graphql-tag';
const MY_QUERY = gql`
  query {
    books{
			_id
      title
      author
		}
  }
`

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:3000/graphql' }),
  cache: new InMemoryCache()
});

//client.query({query: MY_QUERY}).then(console.log);





const TodoApp = ({ data: { books } }) =>{
  return (
    <ul>
      {books && books.map(({ _id, title, author }) => (
        <li key={_id}>{title}</li>
      ))}
    </ul>
  );
}
const QueryTodoApp = graphql(MY_QUERY)(TodoApp)


class App extends Component {
  render() {
    return (
		<ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
				<QueryTodoApp/>
      </div>
		</ApolloProvider >
    );
  }
}

export default App;
