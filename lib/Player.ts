import Token from './Token'
import { TokenColor } from './enums'

/**This represents a player */
export interface Player extends VisiblePlayer {
	/**
	 * This authorisation token is required to perform validated requests like rolling the dice
	 */
	AuthorisationToken: string
}

/** This represents Player data as it should be visible to the client hiding the AuthorisationToken */
export interface VisiblePlayer {
	/** This array represents all the tokens owned by the player */
	token: Token[]
	/** The color of the player */
	color: keyof keyof TokenColor
}
