import express from 'express'
import serverless from 'serverless-http'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/noad_test_1', (req: any, res: any) => {
  res.send('lol----1')
})

app.get('/noad_test_1/api/info', (req: any, res: any) => {
  res.send({ application: 'sample-app', version: '1' })
})

// app.post('/noad_test_1/api/v1/getback', (req: any, res: any) => {
//   res.send({ ...req.body })
// })

//app.listen(3000, () => console.log(`Listening on: 3000`));
// module.exports.handler = serverless(app)
module.exports.handler = serverless(app)
