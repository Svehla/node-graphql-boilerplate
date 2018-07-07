### Requirments
Nodejs at least 8.9.3, yarn and mysql.

When you haven't mysql db on local machine, you can use docker and docker-compose with nodejs and mongo db container.
TODO: add docker

### Installation
1. install on your OS: `node`, `yarn`, `docker`
2. run `yarn` to install dependecies
3. run `docker-compose up` to start app and database

### Developing
- run `yarn lint` for lint :)
- run `yarn lint:fix` for fix lint error
- run `yarn lint:watch` for watching

#### how debug node app via chrome devtools
[more info:](https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27)
- start app
- open `chrome://inspect/#devices`


### Production build
1. run `yarn build` to build static js files
2. run `yarn start` to start node server

## Authorization
How to get token from logged user
```
mutation UserLoginMutation {
  UserLoginMutation(input: {
    email: "john0@example.com",
    password: "1111"
  }) {
    token
    user {
      id 
      name
    }
  }
}
```

```
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNTMwOTQ3MTI4fQ.0roGF3qFgXaIk5hgTNGd0kY2Kc927CoO1xcDWpBy_SY"
}
```



TODO:
- create special user for prod db (cant remove db )
- dont remove prod db with clean script 
- deploy on server
- solve docker config ports
- write readme
- build typescript