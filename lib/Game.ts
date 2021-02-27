import { NextApiResponse } from 'next'
import { Player, VisiblePlayer } from './Player'
import randomString from './randomString'

import { TokenColor } from './enums'

/** This represents all the data that is to be stored by MongoDB */
export class Game {
	/** The unique id of the game as stored in database */
	_id: string
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
		this._id = randomString(6)
		this.createdAt = new Date()
		this.player_limit = player_limit
		this.admin_token = randomString(25)
		this.player = []
		this.player.push({
			color: TokenColor.RED,
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
export class VisibleGame {
	/** The unique id of the game as stored in database */
	_id: string
	/** The most number of player which join the current game */
	player_limit: number
	/** This array represents all the players in the game */
	player: VisiblePlayer[]
	constructor(game: Game) {
		this._id = game._id
		this.player_limit = game.player_limit
		this.player = []
		game.player.forEach((player) => {
			let { AuthorisationToken, ...xyz } = player
			this.player.push(xyz)
		})
	}
}
