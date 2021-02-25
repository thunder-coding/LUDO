/** This object represents a token */
export default interface Token {
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
