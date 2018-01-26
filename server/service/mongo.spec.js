const {DbHandler, connectToMongo, add, find, rm} = require('./mongo')
var chai = require('chai')
var assert = chai.assert;


const url = 'mongodb://localhost:27017/dytt';
const collection = 'test'

describe('mongo', function(){
  var testdb

  before(()=>{
    //connect to mongo
    return connectToMongo(url)
    .then((db)=>{
      testdb = db
      rm(testdb, collection)
    })

  })

  it('create', function(done){
    add(testdb, collection, {name: 1})
    .then((result)=>{
      return find(testdb, collection)
    })
    .then((result)=>{
      done()
    })
    .catch(err=>{
      done(err)
    })
  })

  it('connect to mongo', function(done){
    connectToMongo(url)
    .then(db=>{
      done()
    })
  })


})
