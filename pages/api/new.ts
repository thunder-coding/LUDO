import type { NextApiRequest, NextApiResponse } from 'next'

import connect from '../../lib/connect'
import { Game, VisibleGame } from '../../lib/Game'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method != 'POST') {
		res
			.status(405)
			.json({ message: `Method ${req.method} not allowed. Use only POST` })
		return
	}
	try {
		var Mongo = await connect()
	} catch {
		console.error('Database connection error')
		res.setHeader('DB-Connection-Failed', '')
		res.status(500).json({ error: 'Connection to database Failed' })
		return
	}

	let newGame: Game = new Game(4, res)
	try {
		newGame = new Game(+req.body.player_limit || 4, res)
	} catch (e) {
		res.statusCode = 400
		res.json({ message: e.message })
		console.log(e)
	}

	await Mongo.db().collection('main').insertOne(newGame)

	// We don't need to run this everytime new game is created. only running this once will create a background process in mongod which will automatically drop stale data in database
	// await Mongo.db().collection('main').createIndex({createdAt: 1}, {expireAfterSeconds: 86400})

	if (!res.writableEnded) res.status(200).json(new VisibleGame(newGame))
}
