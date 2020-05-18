import Deck from './Deck';

class DefaultDeck extends Deck {
    constructor({id, name, elementId, options}) {
        super(id, name, elementId, options);
    }
}

export default DefaultDeck
