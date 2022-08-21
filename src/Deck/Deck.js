import { Card } from '../Card';

/**
 * Generate a deck
 * @class
 */

class Deck {
  /**
   *
   * @param id {string}
   * @param name {string}
   * @param elementId {string}
   * @param {object} [options] - options
   * @param  {string} [options.numberOfEachCard=1] - number of each card
   * @param  {object} [options.cardSuits={ 'hearts': 'red', 'clubs': 'black', 'diamonds': 'red', 'spades': 'black' }] - property name will be combined with cardValue property name to generate the card front image path & value will be set to prop suit  e.g ahearts, 2hearts.jpg
   * @param  {object} [options.cardValues={ A: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 11, Q: 12, K: 13 }] - property name will be combined with suit property name to generate the card front image path & value will be set to prop value e.g ahearts, 2hearts.jpg
   * @param  {array} [options.imageNames=[]] - create cards using just card names - should match the name of the images
   * @param  {string} [options.imagePath=images/game-of-cards/default-cards] - where to for the cards
   * @param  {string} [options.backOfCardSrc=back.png] - name of the imaae to use for the back of the card
   * @param  {string} [options.frontOfCardSrc=front.png] - name of the imaae to use for the front of the card
   * @param  {string} [options.cardSectionClass=card-container] - class to use for the card container
   * @param  {string} [options.customCardContainerClass=''] - extra class to use for the card container
   * @param  {string} [options.imageExt=jpg] - extension of the card images to use
   * @param  {boolean} [options.useSuits=true] - define whether to use suits from the cardSuits property
   * @param  {boolean} [options.addValues=true] - define whether to set the card values from the cardValues property
   * @param  {boolean} [options.cheat=true] - define whether to add cheat class to cards
   */
  constructor(
    id,
    name = 'standard playing cards',
    elementId = 'js-deck',
    options
  ) {
    const defaultOptions = {
      numberOfEachCard: 1,
      cardSuits: {
        hearts: 'red',
        clubs: 'black',
        diamonds: 'red',
        spades: 'black',
      },
      cardValues: {
        A: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        J: 11,
        Q: 12,
        K: 13,
      },
      imageNames: [],
      imagePath: 'images/game-of-cards/default-cards',
      backOfCardSrc: 'back.png',
      frontOfCardSrc: 'front.png',
      cardSectionClass: 'goc-card-container',
      customCardContainerClass: '',
      imageExt: 'jpg',
      useSuits: true,
      addValues: true,
      cheat: false,
      cardValuesArePaths: false,
      cardValuesAreBase: false,
      backOfCardBaseSrc: null,
    };

    const combinedOptions = Object.assign({}, defaultOptions, options);

    Object.defineProperties(this, {
      _id: {
        value: id,
        writable: false,
      },
    });
    Object.defineProperties(this, {
      name: {
        value: name,
        writable: false,
      },
    });

    Object.defineProperties(this, {
      elementId: {
        value: elementId,
        writable: false,
      },
    });

    this._ids = combinedOptions._ids || [];
    this._DOMCards = combinedOptions._DOMCards || [];
    this._DOMDeck = combinedOptions._DOMDeck || [];
    this.numberOfEachCard = combinedOptions.numberOfEachCard || 1;
    this.cardSuits = combinedOptions.cardSuits;
    this.imageNames = combinedOptions.imageNames;
    this.cardValues = combinedOptions.cardValues;
    this.imagePath = combinedOptions.imagePath;
    this.cardSectionClass = combinedOptions.cardSectionClass;
    this.backOfCardSrc = combinedOptions.backOfCardSrc;
    this.frontOfCardSrc = combinedOptions.frontOfCardSrc;
    this.imageExt = combinedOptions.imageExt;
    this.cards = combinedOptions.cards || [];
    this.customCardContainerClass = combinedOptions.customCardContainerClass;
    this.useSuits = combinedOptions.useSuits;
    this.addValues = combinedOptions.addValues;
    this.areas = combinedOptions.areas;
    this.cheat = combinedOptions.cheat;
    this.cardValuesArePaths = combinedOptions.cardValuesArePaths;
    this.cardValuesAreBase = combinedOptions.cardValuesAreBase;
    this.backOfCardBaseSrc = combinedOptions.backOfCardBaseSrc;

    this.createDeckObj();
  }

  /**
   * Make random number for card id
   *
   * @param ids
   * @returns {*}
   */
  newNumber(ids) {
    // get random num
    let randId = `_${Math.floor(Math.random() * 10000000)}`;

    // loop check ids array doesn't already have randId
    if (ids.indexOf(randId) === -1) {
      // push it in or get another id
      ids.push(randId);
      return randId;
    } else {
      return this.newNumber(ids);
    }
  }

  /**
   * Make the deck object - need a way to make pairs when the image
   * passed in is to be used more than once, numberOfCards or number of pairs?
   *
   */
  createDeckObj() {
    // can't do this without nodejs
    // if(this.getNamesFromPath) {
    //   console.log('get img names from this dir', this.imagePath);
    //   try {
    //   var files = fs.readdirSync(this.imagePath);
    //     console.log('files', files)
    //   } catch(err) {
    //     console.log('err', err)
    //   }
    //
    // }

    for (const suit in this.cardSuits) {
      for (const name in this.cardValues) {
        let count = 0;

        while (count < this.numberOfEachCard) {
          let randId = this.newNumber(this._ids);
          let cardName = `${name}${suit}`;

          cardName =
            this.cardValuesArePaths || this.cardValuesAreBase
              ? name
              : `${name}${suit}`;

          let card = new Card({
            name,
            value: this.addValues ? this.cardValues[name] : 0,
            suit: this.useSuits ? suit : '',
            image: this.cardValuesAreBase
              ? cardName
              : `${this.imagePath}/${cardName}.${this.imageExt}`,
            imageDefault: `${this.imagePath}/${this.frontOfCardSrc}`,
            cardColor: this.cardSuits[suit],
            id: randId.toString(),
          });
          this.cards.push(card);

          count++;
        }
      }
    }
  }

  /**
   * make the html markup for appending to DOM
   */
  makeDomDeck() {
    const backOfCard = this.backOfCardBaseSrc
      ? this.backOfCardBaseSrc
      : `${this.imagePath}/${this.backOfCardSrc}`;

    this._DOMCards = this.cards.map((card) => {
      return `<section class="${this.cardSectionClass} ${
        this.customCardContainerClass
      }" style="transform: translate(0px,0px);">
                <div class="goc-card" id="${card._id}">
                <figure class="goc-back"><img src="${backOfCard}" alt="back of card"></figure>
                <figure class="goc-front"><img src="${this.imagePath}/${
        this.frontOfCardSrc
      }" alt="front of card"></figure>
                ${
                  this.cheat
                    ? `<p class="goc-cheat">${card.name} ${card.suit}</p>`
                    : ''
                }
                </div>
                </section>`;
    });
  }

  /**
   * Add the deck to a dom element
   *
   * @param elementId
   * @param domString
   */
  addDeckToDOM(elementId = this.elementId, domString = this._DOMCards) {
    document.getElementById(elementId).innerHTML = domString.join('');
  }

  assignCardDomToCardObj(cards = this.cards) {
    let cardNode,
      realDOM = [];

    for (let card of cards) {
      cardNode = document.getElementById(card._id);
      realDOM.push(cardNode);
      // card.dom = cardNode.parentNode;
      card.setDom(cardNode.parentNode);
    }

    return realDOM;
  }

  /**
   * This shuffles the pure deck card objects
   *
   * @returns {*}
   */
  shuffleCardsObj(array = this.cards) {
    // console.log('core/Deck shuffleDeckObj');
    // do the fisher yates shuffle
    // let array = this.cards;

    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  /**
   * Allows finding of card by id (ids are created when deck is created and match id on the dom)
   *
   * @param id {string}
   */
  findCardById(id) {
    return this.cards.find((o) => o._id === id);
  }

  // propHasThisManyCards(prop, amount) {
  //
  //   try {
  //     if (this.hasOwnProperty(prop)) {
  //       return Object.keys(this[prop]).length === amount;
  //     } else {
  //       // @TODO replace throw with console.error??
  //       throw 'propertyNoFoundException';
  //     }
  //   } catch (e) {
  //     this.handleMyErrors(e);
  //   }
  // }

  //@TODO make own object for handling errors?
  handleMyErrors(e) {
    console.error('error', e);
  }
}

export default Deck;
