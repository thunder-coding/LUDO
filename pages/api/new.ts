import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient } from 'mongodb'

function generateToken() {
	let token = ''
	for (let i = 0; i < 25; i++)
		token += Math.floor(Math.random() * 36).toString(36)
	return token
}

interface Token {
	_id: number
	position: number
}

interface Player {
	_id: number
	AuthorisationToken: string
	token: Token[]
}

interface VisiblePlayer {
	_id: number
	token: Token[]
}

class Game {
	player_limit: number
	admin_token: string
	player: Player[]
	constructor(player_limit: number = 2, Res: NextApiResponse) {
		if (player_limit > 4 || player_limit < 2) {
			throw new Error('Maximum player limit should be within 2-4.')
		}
		this.player_limit = player_limit
		this.admin_token = generateToken()
		this.player = []
		this.player.push({
			_id: 1,
			AuthorisationToken: this.admin_token,
			token: [
				{ _id: 1, position: -1 },
				{ _id: 1, position: -1 },
				{ _id: 1, position: -1 },
				{ _id: 1, position: -1 },
			],
		})
		return this
	}
}

class VisibleGame {
	player_limit: number
	player: VisiblePlayer[]
	constructor(game: Game) {
		this.player_limit = game.player_limit
		this.player = []
		game.player.forEach((player) => {
			let { AuthorisationToken, ...xyz } = player
			this.player.push(xyz)
		})
	}
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method != 'POST') {
		res
			.status(405)
			.json({ message: `Method ${req.method} not allowed. Use only POST` })
		return
	}
	const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/test?retryWrites=true&w=majority`
	const Mongo = new MongoClient(URI, { useUnifiedTopology: true })
	try {
		await Mongo.connect()
	} catch {
		console.error('Database connection error')
		res.setHeader('DB-Connection-Failed', '')
		res.status(500).json({ error: 'Connection to database Failed' })
		return
	}

	let newGame: Game = new Game(4, res)
	try {
		newGame = new Game(3, res)
	} catch (e) {
		res.statusCode = 400
		res.json({ message: e.message })
		console.log(e)
	} finally {
		console.log(newGame)
	}

	await Mongo.db("production").collection("main").insertOne(newGame)
	
	if (!res.writableEnded) res.status(200).json(new VisibleGame(newGame))
}
