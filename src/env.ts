import { z } from "zod"
import "dotenv/config"

const envSchema = z.object({
	PORT: z.coerce.number().default(3030),
	RMQ_USER: z.string(),
	RMQ_PASSWORD: z.string(),
	RMQ_HOST: z.string(),
	RMQ_PORT: z.coerce.number().default(5672),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
	console.error("Invalid environment variables", _env.error.format())

	throw new Error("Invalid environment variables.")
}

export const env = _env.data
