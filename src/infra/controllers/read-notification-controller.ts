import { mqConnection } from "@/lib/rabbitmq"
import type { Request, Response } from "express"

export async function readNotificationController(_: Request, res: Response) {
	try {
		await mqConnection.connect()

		const result = await mqConnection.consumeFromQueue("notifications", 5000)

		return res
			.status(200)
			.json({ success: true, message: JSON.parse(result.content.toString()) })
	} catch (error: unknown) {
		if (error instanceof Error) {
			return res.status(408).json({ success: false, message: error.message })
		}
	} finally {
		await mqConnection.closeConnection()
	}
}
