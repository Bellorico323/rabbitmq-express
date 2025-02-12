import { mqConnection } from "@/lib/rabbitmq"
import type { NextFunction, Request, Response } from "express"
import { z } from "zod"

const sendNotificationBody = z.object({
  status: z.string(),
  message: z.string()
})

export async function sendNotificationController(req: Request, res: Response, next: NextFunction) {
  const { status, message } = sendNotificationBody.parse(req.body)

  try {
    await mqConnection.connect()

    await mqConnection.sendToQueue("notifications", { status, message })

    return res.status(200).json({ success: true, message: "Notificação enviada com sucesso!" })
  } catch (error) {
    next(error)
  }
}