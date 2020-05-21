import DefaultDeck from './DefaultDeck';
import MatchingDeck from './MatchingDeck';

/**
 * @class
 */

class DeckFactory {

  constructor() {
    this.deckClass = DefaultDeck;
  }

  createDeck(type, props) {
    switch (type) {
      case 'default':
        this.deckClass = DefaultDeck;
        break;
      case 'matching':
        this.deckClass = MatchingDeck;
        break;
    }

    return new this.deckClass(props);
  };

}

export default DeckFactory;
