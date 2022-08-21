import Player from './Player';

/**
 * A default player
 * @extends Player
 */

class DefaultPlayer extends Player {
  constructor({ id, name, options }) {
    super(id, name, options);
  }
}

export default DefaultPlayer;
