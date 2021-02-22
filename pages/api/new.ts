import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient } from 'mongodb'

function generateToken() {
	let token = ''
	for (let i = 0; i < 25; i++)
		token += Math.floor(Math.random() * 36).toString(36)
	return token
}

/** This object represents a token */
interface Token {
	/**
	 * The unique token number of each token held by the player
	 * <br>
	 * Range 1 to 4
	 */
	_id: number
	/**
	 * The current position of the this token.
	 *
	 * Range:  -1 to 56
	 *
	 * -1 represents that the token has not yet started it's journey \
	 *  0 represents that the token is on the first position relative to it's start
	 */
	position: number
}

/**This represents a player */
interface Player {
	/**
	 * The unique id of the player
	 *
	 * Range: 1 to 4
	 */
	_id: number
	/**
	 * This authorisation token is required to perform validated requests like rolling the dice
	 */
	AuthorisationToken: string
	/** This array represents all the token's owned by the player */
	token: Token[]
}

/** This represents Player data as it should be visible to the client hiding the AuthorisationToken */
interface VisiblePlayer {
	/**
	 * The unique id of the player
	 *
	 * Range: 1 to 4
	 */
	_id: number
	/** This array represents all the tokens owned by the player */
	token: Token[]
}

/** This represents all the data that is to be stored by MongoDB */
class Game {
	/** The most number of player which join the current game */
	player_limit: number
	/**
	 * This represents the Authorisation Token of the owner of the game (The one who started it)
	 *
	 * It has been stored seperately because the admin should have much more permissions than other players
	 */
	admin_token: string
	/** This array represents all the players in the game */
	player: Player[]
	/** The timestamp when the game was created. This is to auto clean old game records from the database */
	createdAt: Date
	constructor(player_limit: number = 2, Res: NextApiResponse) {
		if (player_limit > 4 || player_limit < 2) {
			throw new Error('Maximum player limit should be within 2-4.')
		}
		this.createdAt = new Date()
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

/** This represents Game as it should be visible to the client, hiding all the AuthorisationTokens */
class VisibleGame {
	/** The most number of player which join the current game */
	player_limit: number
	/** This array represents all the players in the game */
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

	await Mongo.db('production').collection('main').insertOne(newGame)

	// We don't need to run this everytime new game is created. only running this once will create a background process in mongod which will automatically drop stale data in database
	// await Mongo.db('production').collection('main').createIndex({createdAt: 1}, {expireAfterSeconds: 86400})

	if (!res.writableEnded) res.status(200).json(new VisibleGame(newGame))
}
