import { MongoClient } from 'mongodb'

export default async function connect() {
	const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/production?retryWrites=true&w=majority`
	const Mongo = new MongoClient(URI, { useUnifiedTopology: true })

	Mongo.connect()
	return Mongo
}
