var MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/graphql';

function connectToMongo(url){
  return new Promise((resolve, reject)=>{
    MongoClient.connect(url, (err,db)=>{
      if (err){
        reject(err)
      }else{
        resolve(db)
      }
    });
  })
}

function add(db, collection, data){
  return new Promise((resolve, reject)=>{
    const c= db.collection(collection)
    c.insert(data, (err, result)=>{
      if (err){
        reject(err)
      }else{
        resolve(result.ops[0])
      }
    })
  })
}

function find(db, collection, query){
  return new Promise((resolve, reject)=>{
    const c= db.collection(collection)
    c.find(query).toArray((err, result)=>{
      if (err){
        reject(err)
      }else{
        resolve(result)
      }
    })
  })
}

function findOneAndUpdate(db, collection, query, data){
    const c= db.collection(collection)
    return c.findOneAndUpdate(query, {$set: data})
}

function deleteOne(db, collection, params){
  const c= db.collection(collection)
  return c.deleteOne(params)
}




class DbHandler{
  constructor(){
    this.url = url
    this.db = null;
    this.init()
  }

  init(){
    return connectToMongo(url)
    .then((db)=>{
      this.db = db
      console.log('db init')
      return Promise.resolve()
    })
  }

  add(collection, data){
    return add(this.db, collection, data)
  }

  find(collection, query={}){
    return find(this.db, collection, query)
  }

  update(collection, query, update ){
   return findOneAndUpdate(this.db, collection, query, update )
  }

  deleteOne(collection, query){
    return  deleteOne(this.db, collection, query)
  }

}


const db = new DbHandler(url)

module.exports.connectToMongo = connectToMongo
module.exports.add = add
module.exports.find = find
module.exports.deleteOne = deleteOne
module.exports.db = db
