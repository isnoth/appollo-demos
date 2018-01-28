import React  from 'react';
import {  graphql } from 'react-apollo';

const { QUERY_DETAIL } = require('./query-mutation')

const BookDetail = ({data: {book}})=>{
  return <div>
    <p>{book && book._id} </p>
    <p>{book && book.title} </p>
    <p>{book && book.author} </p>
  </div>
}
export default graphql(QUERY_DETAIL, {
  options: ownProps=>({
    variables: {
      id: ownProps.match.params.id
    }
  })
})(BookDetail)
