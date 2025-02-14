import cors from "cors"
import express from "express"
import { env } from "./env"
import { readNotificationController } from "./infra/controllers/read-notification-controller"
import { sendNotificationController } from "./infra/controllers/send-notification-controller"
import { asyncHandler } from "./utils/async-handler"

const app = express()

app.use(cors())

app.use(express.json())

app.post("/notifications/send", asyncHandler(sendNotificationController))
app.get("/notifications/read", asyncHandler(readNotificationController))

app.listen(3030, () => {
	console.log(`🚀 App runnin in http://localhost:${env.PORT}`)
})
