import DeckFactory from '../Deck/DeckFactory';
import PlayerFactory from '../Player/PlayerFactory';

class Game {
  constructor(options) {
    const defaultOptions = {
      name: 'GameOfCards',
      data: {}
    }

    let newOptions = Object.assign({}, defaultOptions, options)
    this.name = newOptions.name;
    this.data = newOptions.data || {};
    this.decks = [];
    this.deck = {};
    this.players = [];
    this.events = {}

    this.deckFactory = new DeckFactory();
    this.playerFactory = new PlayerFactory();
  }

  createStandardDeck(id, name, elementId, options, addToGame = true) {
    const deck = this.deckFactory.createDeck('default', { id, name, elementId, options });
    if (addToGame) {
      this.addDeckToDecks(deck);
    }
    return deck;
  }

  addDeckToDecks(deck) {
    this.decks.push(deck);
  }

  createPlayer(id, name, options, addToGame = true) {
    const player = this.playerFactory.createPlayer('default', { id, name, options });
    if (addToGame) {
      this.addPlayerToPlayers(player);
    }
    return player;
  }

  addPlayerToPlayers(player) {
    this.players.push(player);
  }

  // createHand(id, owner, options, addToPlayer = true) {
  //     console.log('Game.createHand');
  //     const hand = new Hand(id, owner, options)
  // }

  /**
   * set the afterCardFaceUp function on a card
   * would be 2 expensive?, especially if there were many of these vs making user do it in a loop
   *
   * @param callback
   */
  setAfterCardFaceUp(callback) {
    for (let card of this.deck.cards) {
      card.afterCardFaceUp = callback;
    }
  }

  setAfterCardFaceDown(callback) {
    for (let card of this.deck.cards) {
      card.afterCardFaceDown = callback;
    }
  }

  /**
   * What if wanted click events on cards in a certain place, ie how to select cards to apply event to
   *
   * @param callback
   */
  setCardClick(cards, callback) {
    console.log('Game set cardClick');
    for (let card of cards) {
      card.onClick = callback;
    }
  }

  /**
   * Remove click event
   *
   * @param callback
   */
  removeCardClick(cards, callback) {
    for (let card of cards) {
      card.clearClick();
    }
  }

  // @TODO change this
  removeEvents(items) {
    console.log('game - removeEvents ', items);

    // @TODO remove comment - in instead of of as iterating object
    for (let item in items) {
      items[item].removeAllEvents();
    }
  }

  findPlayerByName(name) {
    if (this.players.length > 0) {
      return this.players.find(player => player.name === name);
    }
  }

  addDeckToDom(deckId) {
    const deck = deckId ? this.findDeckById(deckId) : this.decks[0];
    deck.addDeckToDOM();

    return this;
  }

  addDeckToDomOld(ElementId, markUp = this.deck._DOMCards) {
    document.getElementById(ElementId).innerHTML = markUp.join('');
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

  findDeckById(id) {
    return this.decks.find(deck => deck._id === id);
  }

  findPlayerById(id) {
    return this.players.find(player => player._id === id);
  }

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

export default Game
