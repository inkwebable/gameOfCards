import Player from './Player';

/**
 * Ai Player
 * @extends Player
 */

class AiPlayer extends Player {
  constructor({ id, name, options }) {
    super(id, name, options);

    Object.defineProperty(this, 'dealer', {
      value: options.dealer,
      writable: false
    });
  }
}

export default AiPlayer;
