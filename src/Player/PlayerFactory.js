import DefaultPlayer from "./DefaultPlayer";
import AiPlayer from './AiPlayer';

/**
 * Player Factory
 * @class
 */
export default class PlayerFactory {
  constructor() {
    this.playerClass = DefaultPlayer;
  }

  createPlayer(type, props) {
    switch (type) {
      case 'ai':
        this.playerClass = AiPlayer
        break;
      default:
        this.playerClass = DefaultPlayer;
    }

    return new this.playerClass(props);
  };

}
