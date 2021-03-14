// import { appConfig, appEnvs } from './appConfig'
// import express from 'express'

// const getApp = () => {
//   const app = express()

//   app.use(express.urlencoded({ extended: true }))
//   app.use(express.json())

//   app.get('/config', (req: any, res: any) => {
//     res.send({ appConfig, appEnvs })
//   })

//   app.get('/noad_test_1', (req: any, res: any) => {
//     res.send('lol----1')
//   })

//   app.get('/noad_test_1/api/info', (req: any, res: any) => {
//     res.send({ application: 'sample-app', version: '1' })
//   })

//   app.get('*', (req: any, res: any) => {
//     res.send('404 xd')
//   })

//   return app
// }

// export const app = getApp()
