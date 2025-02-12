import express from "express"
import cors from 'cors'
import { env } from "./env"
import { sendNotificationController } from "./infra/controllers/send-notification-controller"
import { asyncHandler } from "./utils/async-handler"

const app = express()

app.use(cors())

app.use(express.json())

app.post('/notifications/send', asyncHandler(sendNotificationController))

app.listen(3030, () => {
	console.log(`🚀 App runnin in http://localhost:${env.PORT}`)
})
