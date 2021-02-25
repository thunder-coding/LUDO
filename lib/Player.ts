import Token from './Token'

/**This represents a player */
export interface Player {
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
export interface VisiblePlayer {
	/**
	 * The unique id of the player
	 *
	 * Range: 1 to 4
	 */
	_id: number
	/** This array represents all the tokens owned by the player */
	token: Token[]
}
