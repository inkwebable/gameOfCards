import { Hand } from '../Hand';

/**
 * Generate a Player
 * @class
 * @property {string | number} id - The name of the person.
 * @property {string} name - The name of the person.
 * @property {Hand} hand - The player hand.
 * @property {boolean} ready - Is the player ready
 * @property {boolean} turn - Is the players turn
 */

class Player {

  /**
   *
   * @param id {string | number}
   * @param name {string}
   * @param {object} [options={playing: true, ready: false, turn: false}] - options
   * @param  {boolean} [options.playing=true] - player is playing
   * @param  {boolean} [options.ready=false] - player is ready
   * @param  {boolean} [options.turn=false] - its this players turn
   */
    constructor(id, name = 'player', options) {

      const defaultOptions = {
        playing: true,
        ready: false,
        turn: false,
      }

      let newOptions = Object.assign({}, defaultOptions, options);
      Object.defineProperties(this, {
        '_id': {
          value: id,
          writable: false,
        },
      });

      this.name = name;
      this.hand = [];
      this.ready = newOptions;
      this.turn = newOptions;
    }

  /**
   * Create a hand for a player
   * @param id {string | number}
   * @param options
   * @returns {Hand}
   */
    createHand(id, options) {
      this.hand = new Hand(id, options);

      Object.defineProperty(this.hand, 'player', {
        value: this,
        writable: false
      });

      return this.hand;
    }
}

export default Player;
