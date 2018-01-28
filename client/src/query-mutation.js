
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

export {QUERY_LIST, QUERY_DETAIL, CREATE_BOOK_MUTATION, DELETE_BOOK_MUTATION}
