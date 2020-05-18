import Area from '../Area/Area';
import Card from '../Card/Card';

class Hand {
  constructor(id, options) {
    const defaultOptions = {
      allowFlip: true,
      cardsCanBeAdded: true,
      cardsCanBeClicked: true,
      cardsCanBeRemoved: true,
      cardsCanBeSelected: true,
      // rules: {
      //     allowFlip: true,
      //     cardLimit: -1 //infinite,
      // }
    }

    let newOptions = Object.assign({}, defaultOptions, options);
    Object.defineProperties(this, {
      '_id': {
        value: id,
        writable: false,
      },
    });

    this.area = newOptions.area || {};
    this.rules = newOptions.rules || { allowFlip: true, cardLimit: -1 };
    this.cardsCanBeClicked = newOptions.cardsCanBeClicked;
    this.cardsCanBeSelected = newOptions.cardsCanBeSelected;
    this.handleCardAdded = (card, hand) => console.log('Hand.handleCardAdded', card, hand);
    this.handleCardRemoved = (card, hand) => console.log('Hand.handleCardRemoved', card);
    this.events = {
      onCardReceived: () => {},
      onCardAdded: () => {},
      onCardRemoved: () => {},
      onCardRequested: () => {},
    };
    // this.arrayHandler = {
    //   get: (target, key) => {
    //     console.log(`${this._id} proxyCards get`, target, key);
    //     if(key === 'push') {
    //       console.log('push')
    //       this.events.onCardReceived();
    //     }
    //
    //     if(key === 'pop') {
    //       console.log('pop')
    //       this.events.onCardRemoved();
    //     }
    //
    //     return target[key];
    //   },
    //   set: (target, key, val, receiver ) => {
    //     console.log(`${this._id} proxyCards set`, target, key, val, receiver);
    //     if (key !== 'length') {
    //       this.events.onCardAdded();
    //     }
    //
    //     target[key] = val;
    //
    //     return true;
    //   },
    //   deleteProperty: (target, key , test) => {
    //     console.log(`${this._id} proxyCards delete`, target, key, test);
    //     this.events.onCardRemoved();
    //     return true;
    //   },
    // };
    // this.cards = new Proxy([], this.arrayHandler);
    this.cards = [];

    // this.onCardClick = this.onCardClick.bind(this);
    // this.onCardFaceUp = this.onCardFaceUp.bind(this);
    // this.onCardFaceDown = this.onCardFaceDown.bind(this);
  }

  // setCardsContainer(dom) {
  //     // set hand position
  // }

  createArea(id, name, options) {
    this.area = new Area(id, name, options);
    this.area.hand = this;
    Object.defineProperty(this.area, 'hand', {
      value: this,
      writable: false
    });

    return this.area;
  }

  addCardsToHand(cards) {
    // this.cards = cards.filter(card => card instanceof Card);
    let filteredCards = cards.filter(card => card instanceof Card);
    // this.cards = new Proxy(filteredCards, this.arrayHandler);
    this.cards = filteredCards;
    this.onCardsReceived();
  };

  async addCardToHand(card) {
    this.cards.push(card);
    await this.onCardAdded(card);
  };

  async removeCardFromHand(card) {
    this.cards = this.cards.filter(cardObj => cardObj._id !== card._id);
    await this.onCardRemoved(card);
  };

  async onCardAdded(card) {
    console.log('Hand.onCardReceived', card)
    await this.handleCardAdded(card, this);

    return Promise.resolve({ someVal : 'Hand.onCardReceived done'});
  }

  async onCardRemoved(card) {
    console.log('Hand.onCardRemoved', card)
    await this.handleCardRemoved(card, this);

    return Promise.resolve({ someVal : 'Hand.onCardRemoved done'});
  }

  // this should be definable by the user
  onCardsReceived() {
    console.log('onCardsReceived')
  }

  // this should be definable by the user
  async onCardReceived(card, callback) {
    console.log('Hand.onCardReceived');
    // callback();
    // await this.area.onCardReceived(card);

    return Promise.resolve({ someVal: 'onCardReceived' });
  }

  setUpCardEvents() {
    console.log('hand setUpCardEvents', this);
    for (let card of this.cards) {
      card.activateAllEventListeners();
    }
  }

  /**
   * What if wanted click events on cards in a certain place, ie how to select cards to apply event to
   *
   * @param fn
   * @param activateListener
   */
  setCardClickFn(fn, activateListener = true) {
    console.log('Hand set cardClick', this.cards.length);
    if (this.cards.length > 0) {
      for (let card of this.cards) {
        card.setClickEvent(fn, activateListener);
      }
    }
  }

  setAfterCardFaceUpFn(fn, activateListener = true) {
    if (this.cards.length > 0) {
      for (let card of this.cards) {
        card.setTransitionEvent({ onCardFaceUp: fn }, activateListener);
      }
    }
  }

  setAfterCardFaceDownFn(fn, activateListener = true) {
    if (this.cards.length > 0) {
      for (let card of this.cards) {
        card.setTransitionEvent({ onCardFaceDown: fn }, activateListener);
      }
    }
  }

  removeCardEvents() {
    for (let card of this.cards) {
      console.log('removeCardEvents', card);
      const removed = card.removeAllEvents();
      console.log('removed', removed);
    }
  }

  /**
   *
   * @returns {boolean}
   */
  allCardsTransitioned() {
    for (let card of this.cards) {
      if (card.transitioning) {
        return false;
      }
    }

    return true;
  }

  getLastCard() {
    if(this.cards.length > 0) {
      return this.cards[this.cards.length - 1];
    }
  }

  findCardById(id) {
    return this.cards.find(o => o._id === id);
  }
}

export default Hand;
