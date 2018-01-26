var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools');

const { db } = require('./service/mongo')
const {ObjectId}  =require('mongodb')

// Some fake data
let books = [
  {
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

// The GraphQL schema in string form
const typeDefs = `
  type Query {
    books(title: String): [Book]
  }

  type Mutation{
    createBook (
      title: String!
      author: String
    ): Book

    updateBook(
      _id: String!
      author: String
    ): Book
  }

  type Book {
    _id: String
    title: String
    author: String
  }

`;

// The resolvers
const resolvers = {
  Query: { books: (root, args, context) => {
    const params  = args.title?{title: args.title}:{}
    return db.find('book', params )
    //return books
  }},
  Mutation: {
    createBook(root, {title, author}){
      return db.add('book', {title, author})
      //books.push({title, author})
      //return {title, author}
    },
    updateBook(root, {_id, author}){
      return db.update('book', {_id: ObjectId(_id)}, {author})
      //books.push({title, author})
      //return {title, author}
    }
  }
};


// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});


const myGraphQLSchema = schema// ... define or import your schema here!
const PORT = 3000;


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: myGraphQLSchema }));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // if you want GraphiQL enabled


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
