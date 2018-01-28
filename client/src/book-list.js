import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
const {QUERY_LIST, CREATE_BOOK_MUTATION, DELETE_BOOK_MUTATION} = require('./query-mutation')

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

const BookListItem  = ({book:{_id, title, author}, handleDelete})=>(
  <li key={_id}>
    <a href={`/#/book/${_id}`}>{title}</a> <button onClick={()=>handleDelete(_id)}>X</button>
  </li>
)
class BookList extends Component{
  handleDelete(_id){
    const { deleteBook, data: {refetch}} = this.props
    deleteBook({variables: {id: _id}})
    .then(refetch)
  }

  render(){
    const { data: { books, refetch }} = this.props
    return (
      <ul>
        {books && books.map((book) => (
          <BookListItem book={book} handleDelete={this.handleDelete.bind(this)} refetch={refetch}/>
        ))}
        <CreateBookMutation refetch={refetch}/>
      </ul>
    );
  }
}

export default compose(
  graphql(QUERY_LIST),
  graphql(DELETE_BOOK_MUTATION, {
    name: 'deleteBook'
  }),
)(BookList)
