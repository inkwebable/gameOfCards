import Deck from './Deck';

/**
 * Default Deck
 * @class
 */

class DefaultDeck extends Deck {
  constructor({ id, name, elementId, options }) {
    super(id, name, elementId, options);
  }

  // createDeckObj() {
  //   if (this.useSuits) {
  //     for (const suit in this.cardSuits) {
  //       for (const name in this.cardValues) {
  //
  //         let count = 0;
  //
  //         while (count < this.numberOfEachCard) {
  //           let randId = this.newNumber(this._ids);
  //
  //           let card = new Card({
  //             name,
  //             value: this.addValues ? this.cardValues[name] : 0,
  //             suit,
  //             image: `${this.imagePath}/${name}${suit}.${this.imageExt}`,
  //             imageDefault: `${this.imagePath}/${this.frontOfCardSrc}`,
  //             cardColor: this.cardSuits.suit,
  //             id: randId.toString()
  //           });
  //           this.cards.push(card);
  //
  //           count++;
  //         }
  //
  //       }
  //     }
  //   } else {
  //     for (const name in this.cardValues) {
  //
  //       let count = 0;
  //
  //       while (count < this.numberOfEachCard) {
  //         let randId = this.newNumber(this._ids);
  //
  //         let card = new Card({
  //           name,
  //           value: this.addValues ? this.cardValues[name] : 0,
  //           suit: '',
  //           image: `${this.imagePath}/${name}.${this.imageExt}`,
  //           imageDefault: `${this.imagePath}/${this.frontOfCardSrc}`,
  //           cardColor: this.cardSuits.suit,
  //           id: randId.toString()
  //         });
  //         this.cards.push(card);
  //
  //         count++;
  //       }
  //
  //     }
  //   }
  // }
}

export default DefaultDeck;
