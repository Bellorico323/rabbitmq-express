import express from "express"
import { env } from "./env"

const app = express()

app.use(express.json())

app.get("/", (_, res) => {
	res
		.status(200)
		.json({
			message: "Hello World",
		})
		.end()
})

app.listen(3030, () => {
	console.log(`🚀 App runnin in http://localhost:${env.PORT}`)
})
