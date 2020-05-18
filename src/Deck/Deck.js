import Card from '../Card/Card';

class Deck {

    constructor(id, name = 'standard playing cards', elementId = 'js-deck', options) {
        const defaultOptions = {
            numberOfEachCard: 1,
            cardSuits: { 'hearts': 'red', 'clubs': 'black', 'diamonds': 'red', 'spades': 'black' },
            cardColours: ['black', 'red'],
            cardValues: { A: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 11, Q: 12, K: 13 },
            imagePath: 'images/cards/',
            cardSectionClass: 'card-container',
            backOfCardSrc: 'card-back.png',
            frontOfCardSrc: 'default-front.png',
            customCardContainerClass: '',
            allowFlip: true,
        };

        const combinedOptions = Object.assign({}, defaultOptions, options);

        Object.defineProperties(this, {
            '_id': {
                value: id,
                writable: false,
            },
        });
        Object.defineProperties(this, {
            'name': {
                value: name,
                writable: false,
            },
        });

        Object.defineProperties(this, {
            'elementId': {
                value: elementId,
                writable: false,
            },
        });

        this._ids = combinedOptions._ids || [];
        this._DOMCards = combinedOptions._DOMCards || [];
        this._DOMDeck = combinedOptions._DOMDeck || [];
        this.numberOfEachCard = combinedOptions.numberOfEachCard || 1;
        this.cardSuits = combinedOptions.cardSuits;
        this.cardColours = combinedOptions.cardColours;
        this.cardValues = combinedOptions.cardValues;
        this.imagePath = combinedOptions.imagePath;
        this.cardSectionClass = combinedOptions.cardSectionClass;
        this.backOfCardSrc = combinedOptions.backOfCardSrc;
        this.frontOfCardSrc = combinedOptions.frontOfCardSrc;
        this.cards = combinedOptions.cards || [];
        this.customCardContainerClass = combinedOptions.customCardContainerClass;
        this.allowFlip = combinedOptions.allowFlip; // this should be on the card or the hand, not here
        this.areas = combinedOptions.areas;

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
            return this.newNumber(ids)
        }
    }

    /**
     * Make the deck object - need a way to make pairs when the image
     * passed in is to be used more than once, numberOfCards or number of pairs?
     *
     * @returns {Array}
     */
    createDeckObj() {
        for (const suit in this.cardSuits) {
            for (const name in this.cardValues) {

                let count = 0;

                while (count < this.numberOfEachCard) {
                    let randId = this.newNumber(this._ids);

                    let card = new Card({
                        name,
                        suit,
                        image: `${this.imagePath}${name}${suit}.png`,
                        imageDefault: this.imagePath + this.frontOfCardSrc,
                        cardColor: this.cardSuits.suit,
                        id: randId.toString()
                    });
                    this.cards.push(card);

                    count++;
                }

            }
        }
    }

    /**
     * Make the deck object (superceeded by above createDeckObj)
     *
     * @returns {Array}
     */
    createDeckObjOld() {
        console.log('core/Deck createDeckObj');
        for (let t = 0; t < this.cardSuits.length; t++) {

            let cardNumber = 2;
            let suitName = this.cardSuits[t];
            let numberOrLetter;

            for (let i = 0; i < 13; i++) {

                let randId = this.newNumber(this._ids);

                if (i <= 8) {
                    numberOrLetter = cardNumber;
                }
                if (i === 9) {
                    numberOrLetter = "j";
                }
                if (i === 10) {
                    numberOrLetter = "q";
                }
                if (i === 11) {
                    numberOrLetter = "k";
                }
                if (i === 12) {
                    numberOrLetter = "a";
                    cardNumber = 1;
                }

                let imgName = numberOrLetter += suitName;
                let cardColor;

                if (suitName === "clubs") {
                    cardColor = "black";
                }
                else if (suitName === "spades") {
                    cardColor = "black";
                }
                else {
                    cardColor = "red";
                }

                let card = new Card({
                    name: cardNumber,
                    suit: suitName,
                    image: this.imagePath + imgName + ".png",
                    imageDefault: this.imagePath + this.frontOfCardSrc,
                    cardColor: cardColor,
                    id: randId.toString()
                });
                this.cards.push(card);
                cardNumber++;
            }
        }
    }

    /**
     * make the html markup for appending to DOM
     * how could I allow a user change the mark up?
     */
    makeDomDeck(domCards = this._DOMCards) {

        // push html mark up into array
        for (let i = 0; i < this.cards.length; i++) {
            domCards.push(
                `<section key="${i}" class="${this.cardSectionClass} ${this.customCardContainerClass}" style="transform: translate(0px,0px);">
                <div class="card" id="${this.cards[i]._id}">
                <figure class="back"><img src="${this.imagePath}${this.backOfCardSrc}" alt="back of card"></figure>
                <figure class="front"><img src="${this.imagePath}${this.frontOfCardSrc}" alt="front of card"></figure>
                <p class="cheat">${this.cards[i].name} ${this.cards[i].suit}</p>
                </div>
                </section>`
            );
        }
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
        let cardNode, realDOM = [];

        for (let card of cards) {
            cardNode = document.getElementById(card._id);
            realDOM.push(cardNode);
            // card.dom = cardNode.parentNode;
            card.setDom(cardNode.parentNode);
        }

        return realDOM;
    }

    /**
     * recursive function for replacing cards upon shuffleDOMOld
     *
     * @param index
     * @param cards
     * @param temp
     * @param len
     * @param deckId
     * @param callback
     */
    // replaceCard(index, cards, temp, len, deckId, callback) {
    //
    //     console.log('core/Deck replaceCard', index, cards, len);
    //     console.log('core/Deck replaceCard', temp[index], cards[index].children[0].id);
    //
    //     temp[index].className = 'card-container shuffle-left';
    //     temp[index].setAttribute('style', 'z-index:' + index);
    //
    //     setTimeout(() => {
    //         document.querySelector('#' + deckId).replaceChild(cards[index], temp[index]);
    //         cards[index].className = 'card-container shuffle-right';
    //         // console.log('card', cards[index]);
    //         //get the card object
    //         let card = this.findCard(cards[index].children[0].id);
    //         // console.log('card', card);
    //
    //         // replace the dom with the new dom
    //         card.dom = cards[index];
    //         // add events to card
    //         card.setUpEvents();
    //         // alert(card);
    //
    //         index++;
    //         if (index < len) {
    //             this.replaceCard(index, cards, temp, len, deckId, callback);
    //         } else {
    //             console.log(callback);
    //             callback();
    //         }
    //
    //     }, 50);
    // }


    /**
     * This shuffles the pure deck card objects
     *
     * @returns {*}
     */
    shuffleCardsObj(array = this.cards) {
        // console.log('core/Deck shuffleDeckObj');
        // do the fisher yates shuffle
        // let array = this.cards;

        let currentIndex = array.length, temporaryValue, randomIndex;

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
     * @param id
     */
    findCard(id) {
        // @TODO see what happens when card not found
        return this.cards.find(o => o._id === id);
    }

    findCardById(id) {
        return this.cards.find(o => o._id === id);
    }

    /**
     * NOT used
     */
    // flipAllCardsBackToFaceDown() {
    //
    //     // don't have to use DOMCard, can use normal card object as it knows its DOM!?
    //     for (let DOMCard of this._DOMCards) {
    //         let childDiv = DOMCard.children[0];
    //
    //         // card.showBackFace()
    //         let cardObj = this.findCard(childDiv.getAttribute('id'));
    //         cardObj.setDOMClassCard('card');
    //         // childDiv.className = 'card';
    //         cardObj.visible = false;
    //     }
    // }


    /**
     *
     * flip cards back (could be resetPropCards(prop))
     *
     */
    resetFlippedCards(callback) {
        console.log('reset');
        for (let CardObjID in this.flipped) {
            this.flipped[CardObjID].flipCardFaceDown();

        }

        callback();
    }

    /**
     * Used to set up any events - should be on a higher class or removed?
     *
     */
    // setUpEvents() {
    //
    //     this.setUpCardEvents();
    // }

    // think about when we need to setup events on different cards ( e.g in other hands ) differently
    setUpCardEvents() {
        for (let card of this.cards) {
            card.setUpEvents();
        }
    }

    /**
     * Should be allPropCardsTransitioned(prop)??
     *
     * @returns {boolean}
     */
    allFlippedCardsTransitioned() {

        for (let DOMCard in this.flipped) {
            if (this.flipped[DOMCard].transitioning) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check any prop on deck (or game) object for a given number
     *
     * @param prop
     * @param amount
     * @returns {boolean}
     */
    propHasThisManyCards(prop, amount) {

        try {
            if (this.hasOwnProperty(prop)) {
                return Object.keys(this[prop]).length === amount;
            } else {
                // @TODO replace throw with console.error??
                throw 'propertyNoFoundException';
            }
        } catch (e) {
            this.handleMyErrors(e);
        }


    }

    // should be useable from anywhere?
    removeCardFromPropByID(prop, id) {
        // delete this.flipped[cardObj.id];
        return delete this[prop][id];


    }

    //@TODO make own object for handling errors?
    handleMyErrors(e) {
        console.error('error',e);
    }
}

export default Deck;
