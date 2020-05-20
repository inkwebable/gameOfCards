import Player from './Player';

/**
 * A default player
 */
class DefaultPlayer extends Player {
  constructor({ id, name, options }) {
    super(id, name, options);
  }

  readyToPlay() {
    this.ready = confirm('Ready to Start?');
    return this.ready;
  }
}

export default DefaultPlayer
