import React, { Component } from 'react';
import './App.css';

import { Route } from "react-router-dom";

import { ApolloProvider, graphql } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';


import gql from 'graphql-tag';
const QUERY_LIST = gql`
  query {
    books{
			_id
      title
      author
		}
  }
`

const QUERY_DETAIL = gql`
  query ($id: String!){
    book(_id: $id){
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


const BookDetail = ({data: {book}})=>{
  return <div>
    <p>{book && book._id} </p>
    <p>{book && book.title} </p>
    <p>{book && book.author} </p>
  </div>
}
const BookDetailsQuery = graphql(QUERY_DETAIL, {
  options: ownProps=>({
    variables: {
      id: ownProps.match.params.id
    }
  })
})(BookDetail)


const TodoApp = ({ data: { books } }) =>{
  return (
    <ul>
      {books && books.map(({ _id, title, author }) => (
        <li key={_id}>
          <a href={`/#/book/${_id}`}>{title}</a>
        </li>
      ))}
    </ul>
  );
}
const QueryTodoApp = graphql(QUERY_LIST)(TodoApp)


class App extends Component {
  render() {
    return (
		<ApolloProvider client={client}>
      <div className="App">
				<Route exact path={`${process.env.PUBLIC_URL}/`}  component={QueryTodoApp}/>
				<Route exact path={`${process.env.PUBLIC_URL}/book/:id`}  component={BookDetailsQuery}/>
      </div>
		</ApolloProvider >
    );
  }
}

export default App;
