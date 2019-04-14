import gql from 'graphql-tag'

class db {
  constructor(dbRef) {
    this.dbRef = dbRef
  }

  query(_gql, variables) {
    const _this = this
    return new Promise(function(resolve, reject) {
      _this.dbRef
        .query({
          query: gql(_gql),
          variables: variables || {},
          // fetchPolicy: 'network-only'
          fetchPolicy: 'no-cache'
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  mutation(_gql, variables) {
    const _this = this
    return new Promise(function(resolve, reject) {
      _this.dbRef
        .mutate({
          mutation: gql(_gql),
          variables: variables || {},
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

export {db}