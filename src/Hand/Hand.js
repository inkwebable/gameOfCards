import { Area } from '../Area';
import { Card } from '../Card';

/**
 * Generate a Hand
 * @class
 */
export default class Hand {
  constructor(id, options) {
    const defaultOptions = {
      cards: [],
      data: {
        test: 'test'
      },
      rules: {
        test: '',
        cardsCanBeAdded: true,
        cardsCanBeClicked: true,
        cardsCanBeRemoved: true,
        cardsCanBeSelected: true,
        allowFlip: true,
      }
    }

    let newOptions = Object.assign({}, defaultOptions, options);
    let userRules = newOptions.rules;
    let userData = newOptions.data;

    Object.defineProperties(this, {
      '_id': {
        value: id,
        writable: false,
      },
    });

    let newRules = Object.assign({}, defaultOptions.rules, userRules);
    let newData = Object.assign({}, defaultOptions.data, userData);

    this.areas = []; // @TODO solitare would need multiple areas with ids
    this.area = newOptions.area || {}; // @TODO remove - use the method instead to register hand on area
    this.rules = newRules;
    this.data = newData;
    this.handleCardAdded = (card, hand) => {};
    this.handleCardRemoved = (card, hand) => {};

    // for proxy
    // this.events = {
    //   onCardReceived: () => {},
    //   onCardAdded: () => {},
    //   onCardRemoved: () => {},
    //   onCardRequested: () => {},
    // };
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
    this.cards = newOptions.cards || [];
  }

  createArea(id, name, options) {
    this.area = new Area(id, name, options);

    Object.defineProperty(this.area, 'hand', {
      value: this,
      writable: false
    });

    return this.area;
  }

  // does not pass by reference, creates new array of cards!
  addCardsToHand(cards) {
    // this.cards = cards.filter(card => card instanceof Card);
    let filteredCards = cards.filter(card => card instanceof Card);
    // this.cards = new Proxy(filteredCards, this.arrayHandler);
    this.cards = filteredCards;
    // this.onCardsReceived();
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
    // console.log('Hand.onCardReceived', card)
    card.hand = this;
    await this.handleCardAdded(card, this);

    return Promise.resolve({ someVal : 'Hand.onCardReceived done'});
  }

  async onCardRemoved(card) {
    // console.log('Hand.onCardRemoved', card)
    card.hand = null;
    await this.handleCardRemoved(card, this);

    return Promise.resolve({ someVal : 'Hand.onCardRemoved done'});
  }

  setUpCardEvents() {
    console.log('hand setUpCardEvents', this);
    for (let card of this.cards) {
      card.activateAllEventListeners();
    }
  }

  setCardClickFn(fn, activateListener = true) {
    if (this.cards.length > 0) {
      for (let card of this.cards) {
        // card.setClickEvent(fn, activateListener);
        card.onClick = fn.bind(this, { card });
        card.activateClickEventListener();
      }
    }
  }

  setTransitionEvent({ onCardFaceUp , onCardFaceDown }, activateListener = true) {
    if (this.cards.length > 0) {
      for (let card of this.cards) {
        card.setTransitionEvent({ onCardFaceUp: onCardFaceUp.bind(this, { card }), onCardFaceDown: onCardFaceDown.bind(this, { card }) }, activateListener);
      }
    }
  }

  setAfterCardFaceUpFn(fn, activateListener = true) {
    if (this.cards.length > 0) {
      for (let card of this.cards) {
        card.setTransitionEvent({ onCardFaceUp: fn.bind(this, {card}) }, activateListener);
      }
    }
  }

  setAfterCardFaceDownFn(fn, activateListener = true) {
    if (this.cards.length > 0) {
      for (let card of this.cards) {
        card.setTransitionEvent({ onCardFaceDown: fn.bind(this, {card}) }, activateListener);
      }
    }
  }

  removeAllCardEvents() {
    for (let card of this.cards) {
      console.log('Hand.removeAllCardEvents & listeners', card);
      const removed = card.removeAllEvents();
      console.log('removed', removed);
    }
  }

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

  // for proxy
  // // this should be definable by the user
  // onCardsReceived() {
  //   console.log('onCardsReceived')
  // }
  //
  // // this should be definable by the user
  // async onCardReceived(card, callback) {
  //   console.log('Hand.onCardReceived');
  //   // callback();
  //   // await this.area.onCardReceived(card);
  //
  //   return Promise.resolve({ someVal: 'onCardReceived' });
  // }
}
