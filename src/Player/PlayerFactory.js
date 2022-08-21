import AiPlayer from './AiPlayer';
import DefaultPlayer from './DefaultPlayer';

/**
 * Player Factory
 * @class
 */

class PlayerFactory {
  constructor() {
    this.playerClass = DefaultPlayer;
  }

  createPlayer(type, props) {
    switch (type) {
      case 'ai':
        this.playerClass = AiPlayer;
        break;
      default:
        this.playerClass = DefaultPlayer;
    }

    return new this.playerClass(props);
  }
}

export default PlayerFactory;
