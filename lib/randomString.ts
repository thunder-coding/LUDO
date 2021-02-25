/** Generates a random string */
export default function randomString(length: number): string {
	let randomStr = ''
	let randomChar = ''
	for (let i = 0; i < length; i++) {
		randomChar = Math.floor(Math.random() * 36).toString(36)
		randomChar = Math.round(Math.random())
			? randomChar.toUpperCase()
			: randomChar
		randomStr += randomChar
	}
	return randomStr
}
