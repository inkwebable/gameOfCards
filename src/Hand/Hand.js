import { Area } from '../Area';
import { Card } from '../Card';

/**
 * A game object
 * @class
 * @property {string} name - The name of the person.
 * @property {object<*>} data - hold custom data
 * @property {array} decks - hold decks
 * @property {array} players -hold players
 */

class Hand {
  /**
   *
   * @param {object} [options={
   * cards: [], data: { test: 'test'}},
   * rules: {}
   * ] - options
   * @param  {array} options.cards - array of cards
   * @param  {object} options.data={test:'test'} - hold custom data
   */
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

    /** @type {Array} */
    this.areas = []; // @TODO solitare would need multiple areas with ids
    /** @type {Object} */
    this.area =  {};
    /** @type {Object} */
    this.rules = newRules;
    /** @type {Object} */
    this.data = newData;
    /**
     * user definable fn for when a card is added to the hand
     * @param card {Card} a card object
     * @param hand {Hand} a hand object
     */
    this.handleCardAdded = (card, hand) => {};
    /**
     * user definable fn for when a card is removed from the hand
     * @param card {Card} a card object
     * @param hand {Hand} a hand object
     */
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

  /**
   * Create an area for a hand
   * @param id {string}
   * @param name {string}
   * @param options {object}
   * @returns {Object}
   */
  createArea(id, name, options) {
    this.area = new Area(id, name, options);

    Object.defineProperty(this.area, 'hand', {
      value: this,
      writable: false
    });

    return this.area;
  }

  /**
   * Add cards directly to the cards prop - does not pass by reference, creates new array of cards!
   * @param cards {array<Card>}
   */
  addCardsToHand(cards) {
    // this.cards = cards.filter(card => card instanceof Card);
    let filteredCards = cards.filter(card => card instanceof Card);
    // this.cards = new Proxy(filteredCards, this.arrayHandler);
    this.cards = filteredCards;
    // this.onCardsReceived();
  };

  /**
   * Add a card to a hand
   * @async
   * @param card {Card}
   * @returns {Promise<void>}
   */
  async addCardToHand(card) {
    this.cards.push(card);
    await this.onCardAdded(card);
  };

  /**
   * Remove card from hand
   * @async
   * @param card {Card}
   * @returns {Promise<void>}
   */
  async removeCardFromHand(card) {
    this.cards = this.cards.filter(cardObj => cardObj._id !== card._id);
    await this.onCardRemoved(card);
  };

  /**
   * Internal call when a card is added - calls user definable fn {@link Hand#handleCardAdded}
   * @async
   * @param card {Card}
   * @returns {Promise<{someVal: string}>}
   */
  async onCardAdded(card) {
    // console.log('Hand.onCardReceived', card)
    card.hand = this;
    await this.handleCardAdded(card, this);

    return Promise.resolve({ someVal : 'Hand.onCardReceived done'});
  }

  /**
   * Internal call when a card is removed - calls user definable fn {@link Hand#handleCardRemoved}
   * @async
   * @param card
   * @returns {Promise<{someVal: string}>}
   */
  async onCardRemoved(card) {
    // console.log('Hand.onCardRemoved', card)
    card.hand = null;
    await this.handleCardRemoved(card, this);

    return Promise.resolve({ someVal : 'Hand.onCardRemoved done'});
  }

  /**
   * Set all HTMLEvent Listeners on a card
   */
  setUpCardEvents() {
    console.log('hand setUpCardEvents', this);
    for (let card of this.cards) {
      card.activateAllEventListeners();
    }
  }

  /**
   * Set the click fn to be used with the click event listener
   *
   * @param fn {function} function to be set
   * @param activateListener {boolean} activate the listener immediately
   */
  setCardClickFn(fn, activateListener = true) {
    if (this.cards.length > 0) {
      for (let card of this.cards) {
        // card.setClickEvent(fn, activateListener);
        card.onClick = fn.bind(this, { card });
        card.activateClickEventListener();
      }
    }
  }

  /**
   * Set the onCardFaceUp & onCardFaceDown fns to be used with the transitioned event listener
   *
   * @param onCardFaceUp {function}
   * @param onCardFaceDown {function}
   * @param activateListener {boolean}
   */
  setTransitionEvent({ onCardFaceUp , onCardFaceDown }, activateListener = true) {
    if (this.cards.length > 0) {
      for (let card of this.cards) {
        card.setTransitionEvent({ onCardFaceUp: onCardFaceUp.bind(this, { card }), onCardFaceDown: onCardFaceDown.bind(this, { card }) }, activateListener);
      }
    }
  }

  /**
   * Set the onCardFaceUp function
   *
   * @param fn {function}
   * @param activateListener {boolean}
   */
  setAfterCardFaceUpFn(fn, activateListener = true) {
    if (this.cards.length > 0) {
      for (let card of this.cards) {
        card.setTransitionEvent({ onCardFaceUp: fn.bind(this, {card}) }, activateListener);
      }
    }
  }

  /**
   * Set the onCardFaceDown function
   *
   * @param fn {function}
   * @param activateListener {boolean}
   */
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

  /**
   * Get the last card in the hand
   *
   * @returns {Card}
   */
  getLastCard() {
    if(this.cards.length > 0) {
      return this.cards[this.cards.length - 1];
    }
  }

  /**
   * Find a card by id from the hand
   *
   * @param id
   * @returns {Card}
   */
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

export default Hand;
