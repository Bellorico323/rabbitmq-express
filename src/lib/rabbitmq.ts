import { env } from "@/env"
import client, { type Channel, type Connection } from "amqplib"

class RabbitMQConnection {
	connection!: Connection
	channel!: Channel
	private connected!: boolean

	async connect() {
		if (this.connected && this.channel) return

		this.connected = true

		try {
			this.connection = await client.connect("amqp://admin:admin@localhost?5672");

			this.channel = await this.connection.createChannel()
		} catch (error) {
			console.error(error)
			console.error("Not connected to MQ Server")
		}
	}

	async sendToQueue(queue: string, message: unknown) {
		try {
			if (!this.channel) {
				await this.connect()
			}

			this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}

export const mqConnection = new RabbitMQConnection()
