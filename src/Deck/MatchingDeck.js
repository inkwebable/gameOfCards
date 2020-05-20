import Deck from './Deck';
import Card from '../Card/Card';

/**
 * @class
 */
export default class MatchingDeck extends Deck {
  constructor({ id, name, elementId, options }) {
    options.cardSuits = {};
    options.cardValues = options.cardValues ? options.cardValues : {};
    options.useSuits = false
    super(id, name, elementId, options);

  }

  /**
   * Creat deck of cards matching
   */
  createDeckObj() {
    if (this.imageNames.length > 0) {
      this.imageNames.forEach(name => {
        let count = 0;

        while (count < this.numberOfEachCard) {
          let randId = this.newNumber(this._ids);

          let card = new Card({
            name,
            value: this.addValues ? this.cardValues[name] : 0,
            suit: '',
            image: `${this.imagePath}/${name}.${this.imageExt}`,
            imageDefault: `${this.imagePath}/${this.frontOfCardSrc}`,
            cardColor: this.cardSuits.suit,
            id: randId.toString()
          });
          this.cards.push(card);

          count++;
        }
      });
    } else {
      if (Object.keys(this.cardValues).length > 0) {
        for (const name in this.cardValues) {

          let count = 0;

          while (count < this.numberOfEachCard) {
            let randId = this.newNumber(this._ids);

            let card = new Card({
              name,
              value: this.addValues ? this.cardValues[name] : 0,
              suit: '',
              image: `${this.imagePath}/${name}.${this.imageExt}`,
              imageDefault: `${this.imagePath}/${this.frontOfCardSrc}`,
              cardColor: this.cardSuits.suit,
              id: randId.toString()
            });
            this.cards.push(card);

            count++;
          }

        }
      }
    }
  }
}
