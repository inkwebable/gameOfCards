import DefaultPlayer from "./DefaultPlayer";

class PlayerFactory {
  constructor() {
    this.playerClass = DefaultPlayer;
  }

  createPlayer(type, props) {
    switch (type) {
      default:
        this.playerClass = DefaultPlayer;
    }

    return new this.playerClass(props);
  };

}

export default PlayerFactory;
