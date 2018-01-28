import React, { Component } from 'react';
import './App.css';

import { Route } from "react-router-dom";

import { ApolloProvider, graphql, compose } from 'react-apollo';
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

//一定要加! 跟服务端匹配
const CREATE_BOOK_MUTATION = gql`
  mutation createBook($title: String!, $author: String){ 
    createBook(title: $title, author: $author){
      title
      author
    }
}
`

const DELETE_BOOK_MUTATION = gql`
  mutation deleteBook($id: String!){
    deleteBook(_id: $id){
      _id
      title
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


class CreateBook extends Component{
  click(){
    this.props.mutate({
      variables: {title: 'react-title'}
    })
    .then(({data})=>{
      console.log('got Data', data)
      this.props.refetch()
    })
    .catch(err=>{
      console.log(err)
    })
  }
  render(){
    return <button onClick={this.click.bind(this)}>create </button>
  }
}
const CreateBookMutation = graphql(CREATE_BOOK_MUTATION)(CreateBook)




class BookListItem extends Component{
  handleDelete(){
    const {book:{_id, title, author}, deleteBook, refetch} = this.props
    deleteBook({variables: {id: _id}})
    .then(refetch)
  }

  render(){
    const {book:{_id, title, author}} = this.props
    return <li key={_id}>
      <a href={`/#/book/${_id}`}>{title}</a> <button onClick={this.handleDelete.bind(this)}>X</button>
    </li>
  }
}


const BookList = ({ data: { books, refetch }, deleteBook }) =>{
  return (
    <ul>
      {books && books.map((book) => (
        <BookListItem book={book} deleteBook={deleteBook} refetch={refetch}/>
      ))}
      <CreateBookMutation refetch={refetch}/>
    </ul>
  );
}
const BookListWithQuery = compose(
  graphql(QUERY_LIST),
  graphql(DELETE_BOOK_MUTATION, {
    name: 'deleteBook'
  }),
)(BookList)

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
