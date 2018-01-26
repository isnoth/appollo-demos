const {db} = require('./mongo')
const {ObjectId}= require('mongodb')
const collection = "ned"

function getNewestList(len = 10, params={}, neededParams, by='id', page=0){
  //console.log(len, neededParams, by)
  return new Promise((resolve, reject)=>{
    db.db.collection(collection)
    .find(params, neededParams).sort({[by]: -1})
    .skip(page)
    .limit(len)
    .toArray((err, result)=>{
      if(err){
        reject(err)
      }else{
        resolve(result)
      }
    })
  })
}

function getListLength(params={}){
  return new Promise((resolve, reject)=>{
    db.db.collection(collection)
    .count(params,(err, count)=>{
      if (err){
        return rejeccountt(err)
      }else{
        resolve(count)
      }
    })
  })
}

function createProduct({title, avatar=[], description, images}){
  return new Promise((resolve, reject)=>{
    db.db.collection(collection)
    .insertOne({title, avatar, description, images}, (err, res)=>{
      if(err)
        reject(err)
      else
        resolve()
    })
  })
}

function getProduct( productId, neededParams={} ){
  return new Promise((resolve, reject)=>{

    db.db.collection(collection).findOne({_id: ObjectId(productId)}, neededParams)
    .then(product=>{
      resolve(product)
    })
    .catch(reject)

  })
}


module.exports.getNewestList = getNewestList
module.exports.getListLength = getListLength
module.exports.createProduct = createProduct
module.exports.getProduct = getProduct
