export type StorageProps = {
	itemId: string
}

export class Storage {
	public itemId: string

	private constructor(itemId: string) {
		this.itemId = itemId
	}

	public static create({ itemId }: StorageProps) {
		const storage = new Storage(itemId)

		return storage
	}
}
