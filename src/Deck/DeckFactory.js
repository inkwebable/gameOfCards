import DefaultDeck from "./DefaultDeck";

class DeckFactory {

  constructor() {
    this.deckClass = DefaultDeck;
  }

  createDeck(type, props) {
    switch (type) {
      case "default":
        this.deckClass = DefaultDeck;
        break;
    }

    return new this.deckClass(props);
  };

}

export default DeckFactory;

//The factory pattern would enable me to create different types of decks

// A constructor for defining new cars
// function Standard( options ) {
//
//     some defaults
//     this.doors = options.doors || 4;
//     this.state = options.state || "brand new";
//     this.color = options.color || "silver";
//
// }
//
// // A constructor for defining new trucks
// function Custom( options){
//
//     this.state = options.state || "used";
//     this.wheelSize = options.wheelSize || "large";
//     this.color = options.color || "blue";
// }
//
// // Create an instance of our factory that makes decks
// const deckFactory = new DeckFactory();
//
// let plainDeck = deckFactory.createDeck({
//     deckType: 'custom',
//     numberOfCards: 52,
//     imagePath: "images/cards/",
//     cardSectionClass: 'card-container',
//     backOfCardSrc: 'card-back.png',
//     frontOfCardSrc: 'default-front.png',
//     showDeck: false,
//     dealFromDeck: false,
//     deckCardStartNumber,
//     cardSuits: [],
//     cardColors: [],
//     cardValues: [],
// });
//
// console.log('plainDeck instance check', plainDeck instanceof Standard );
