import React, { Component } from 'react';
import './App.css';

import { Route } from "react-router-dom";

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import BookListWithQuery from './book-list'
import BookDetailsQuery from './book-detail'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:3000/graphql' }),
  cache: new InMemoryCache()
});

//client.query({query: MY_QUERY}).then(console.log);


class App extends Component {
  render() {
    return (
		<ApolloProvider client={client}>
      <div className="App">
				<Route exact path={`${process.env.PUBLIC_URL}/`}  component={BookListWithQuery}/>
				<Route exact path={`${process.env.PUBLIC_URL}/book/:id`}  component={BookDetailsQuery}/>
      </div>
		</ApolloProvider >
    );
  }
}

export default App;
