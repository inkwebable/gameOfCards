import { DeckFactory } from '../Deck';
import { PlayerFactory } from '../Player';

/**
 * A game object
 * @class
 * @property {string} name - The name of the person.
 * @property {object<*>} data - hold custom data
 * @property {array} decks - hold decks
 * @property {array} players -hold players
 */

class Game {
  /**
   *
   * @param {object} [options={name: 'GameOfCards', data: {}}] - options
   * @param  {string} options.name=GameOfCards - name of the game
   * @param  {object} options.data={} - hold custom data
   */
  constructor(options) {
    /**
     * default options
     * @type {{data: {}, name: string}}
     */
    const defaultOptions = {
      name: 'GameOfCards',
      data: {}
    }

    let newOptions = Object.assign({}, defaultOptions, options)
    /**
     * @type {string}
     */
    this.name = newOptions.name;
    /**
     * @type {Object}
     */
    this.data = newOptions.data;
    /**
     * @type {Array}
     */
    this.decks = [];
    /**
     * @type {Array}
     */
    this.players = [];

    Object.defineProperties(this, {
      'deckFactory': {
        value: new DeckFactory(),
        writable: false,
      },
      'playerFactory': {
        value: new PlayerFactory(),
        writable: false,
      },
    });
  }

  /**
   * Generates a deck
   * @param id
   * @param {string} name - name of the deck
   * @param {string} elementId - the id of the element
   * @param options
   * @param addToGame {boolean} - add the deck to the game deck property
   * @returns {DefaultDeck}
   */
  createStandardDeck(id, name, elementId, options, addToGame = true) {
    const deck = this.deckFactory.createDeck('default', { id, name, elementId, options });
    if (addToGame) {
      this.addDeckToDecks(deck);
    }
    return deck;
  }

  /**
   * Generates a deck
   * @param id
   * @param {string} name - name of the deck
   * @param {string} elementId - the id of the element
   * @param options
   * @param type {string} - the type of deck to create
   * @param addToGame {boolean} - add the deck to the game deck property
   * @returns {DefaultDeck}
   */
  createDeck(id, name, elementId, options, type= 'default', addToGame = true) {
    const deck = this.deckFactory.createDeck(type, { id, name, elementId, options });
    if (addToGame) {
      this.addDeckToDecks(deck);
    }
    return deck;
  }

  /**
   * Add a deck to the game decks property
   * @param {object} deck
   * @returns {Array}
   */
  addDeckToDecks(deck) {
    this.decks.push(deck);

    return this.decks;
  }

  /**
   * Create a player & optional add to the game
   * @param id
   * @param name
   * @param options
   * @param addToGame
   * @returns {DefaultPlayer}
   */
  createPlayer(id, name, options, addToGame = true) {
    const player = this.playerFactory.createPlayer('default', { id, name, options });
    if (addToGame) {
      this.addPlayerToPlayers(player);
    }
    return player;
  }

  /**
   * Create a dealer for the game
   * @param id
   * @param name
   * @param options
   * @returns {DefaultPlayer}
   */
  createDealer(id, name = 'dealer', options) {
    const defaultOptions = {
      dealer: true, ready: false, playing: false,
    }
    let newOptions = Object.assign({}, defaultOptions, options);
    const player = this.playerFactory.createPlayer('ai', { id, name, options: newOptions });

    if (newOptions.playing) {
      this.addPlayerToPlayers(player)
    }

    this.dealer = player;
    return player
  }

  /**
   * Add a player to the games players
   * @param player
   */
  addPlayerToPlayers(player) {
    this.players.push(player);
  }

  /**
   * Find a player by name
   * @param name
   * @returns {*}
   */
  findPlayerByName(name) {
    if (this.players.length > 0) {
      return this.players.find(player => player.name === name);
    }
  }

  /**
   * Add the deck to the dom
   * @param deckId
   * @returns {Game}
   */
  addDeckToDom(deckId) {
    const deck = deckId ? this.findDeckById(deckId) : this.decks[0];
    deck.addDeckToDOM();

    return this;
  }

  assignCardDomToCardObj(deckId) {
    const deck = deckId ? this.findDeckById(deckId) : this.decks[0];
    return deck.assignCardDomToCardObj();
  }

  shuffleDeckCards(deckId) {
    const deck = deckId ? this.findDeckById(deckId) : this.decks[0];
    deck.shuffleCardsObj();

    return this;
  }

  makeDomMarkUp(deckId) {
    const deck = deckId ? this.findDeckById(deckId) : this.decks[0];
    deck.makeDomDeck();

    return this;
  }

  /**
   * Find a deck by id
   *
   * @example
   * game.findDeckById(1);
   *
   * @param id
   * @returns {*}
   */
  findDeckById(id) {
    return this.decks.find(deck => deck._id === id);
  }

  findPlayerById(id) {
    return this.players.find(player => player._id === id);
  }

  // dealer doesn't have card by reference, so card returned is not from the dealer
  findCardById(cardId) {
    let card = null;
    if (this.decks.length > 0) {
      while (card === null) {
        for (let deck of this.decks) {
          // return undefined or card, breaking while
          card = deck.findCardById(cardId);
          // console.log('Game.findCardById', card);
        }
      }

      return card;
    }
  }
}

export default Game;
