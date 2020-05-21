import { Hand } from '../Hand';

/**
 * @class
 * Generate a Player
 */

class Player {

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
      this.hand = newOptions || [];
      this.ready = newOptions || false;
      this.turn = newOptions || false;
    }

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
