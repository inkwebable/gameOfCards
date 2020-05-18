import Hand from '../Hand/Hand';

class Player {

    constructor(id, name = 'player', options) {
      const defaultOptions = {
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

      return this.hand;
    }

    readyToPlay() {
        this.ready = confirm('Ready to Start?');
        return this.ready;
    }
}

export default Player
