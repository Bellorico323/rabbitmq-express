import client, { type Message, type Channel, type Connection } from "amqplib"

class RabbitMQConnection {
	connection!: Connection
	channel!: Channel
	private connected!: boolean

	async connect() {
		if (this.connected && this.channel) return

		this.connected = true

		try {
			this.connection = await client.connect(
				"amqp://admin:admin@localhost:5672",
			)

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

			await this.channel.assertQueue(queue)
			this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))

			console.log(`📩 Mensagem enviada para a fila "${queue}":`, message)
		} catch (error) {
			console.error("Erro ao enviar mensagem:", error)
			throw error
		}
	}

	async consumeFromQueue(queue: string, timeoutMs = 5000): Promise<Message> {
		return new Promise((resolve, reject) => {
			if (!this.channel) {
				this.connect()
					.then(() =>
						this.consumeFromQueue(queue, timeoutMs).then(resolve).catch(reject),
					)
					.catch(reject)
				return
			}

			this.channel
				.assertQueue(queue)
				.then(() => {
					const consumerTag = `consumer_${Date.now()}`

					// Definir um timeout para evitar que a Promise fique pendente para sempre
					const timeout = setTimeout(() => {
						this.channel.cancel(consumerTag)
						reject(new Error("Timeout: Nenhuma mensagem recebida"))
					}, timeoutMs)

					this.channel.consume(
						queue,
						(message) => {
							if (message) {
								clearTimeout(timeout) // Cancela o timeout se a mensagem for recebida
								this.channel.ack(message)
								resolve(message)
							}
						},
						{ consumerTag }, // Adiciona um identificador para cancelar caso o timeout ocorra
					)
				})
				.catch(reject)
		})
	}

	async closeConnection() {
		try {
			await this.channel.close()
			await this.connection.close()
			this.connected = false
		} catch (error) {
			console.error("Error closing RabbitMQ connection:", error)
			throw error
		}
	}
}

export const mqConnection = new RabbitMQConnection()
