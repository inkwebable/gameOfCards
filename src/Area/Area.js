/**
 * Area
 * @class
 * @property {string | number} _id - The id of the area
 * @property {string} id - The Element id of the area
 * @property {string} name - The name of the area
 * @property {Hand} hand - hand that owns the area
 * @property {boolean} stackVertical - whether the cards should stack on top of eachother
 * @property {boolean} flexArea - whether the area should/is a display:flex
 * @property {boolean} dealCenterLine - whether animation should be dealt directly down from the deck
 * @property {number} maxCardsInHorizontal - how many cards to deal per row (overridden by flexArea)
 */

class Area {
  /**
   *
   * @param id {string | number}
   * @param elementId {string}
   * @param name {string}
   * @param {object} [options={stackVertical: false, maxCardsInHorizontal: 0, flexArea: false, daelCenterLine: false}] - options
   * @param  {boolean} [options.stackVertical=true]
   * @param  {boolean} [options.maxCardsInHorizontal=0]
   * @param  {boolean} [options.flexArea=true]
   * @param  {boolean} [options.dealCenterLine=false]
   */
  constructor(id, elementId, name, options) {
    const defaultOptions = {
      // placeHolders: {}, @TODO
      // stackCardsOnTop: false,
      stackVertical: false,
      // maxCardsInVertical: 12,
      // maxColumnsForVertical: 7,
      // stackHorizontal: false,
      maxCardsInHorizontal: 0,
      // maxRowsForHorizontal: 0,
      flexArea: true,
      dealCenterLine: false,
    };

    const newOptions = Object.assign({}, defaultOptions, options);
    Object.defineProperties(this, {
      _id: {
        value: id,
        writable: false,
      },
      elementId: {
        value: elementId,
        writable: false,
      },
    });

    this.name = name;
    this.placeHolders = newOptions.placeHolders || {};
    this.position = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
    this.siteElementOffsets = {
      top: 72,
      right: 0,
      bottom: 0,
      left: 0,
    };
    this.cards = [];
    this.rules = {
      cardsFaceDown: true,
      cardsFaceUp: false,
      canReceiveCards: true,
      canRemoveCards: true,
      canMoveCards: false,
      canTurnCards: true,
      playerCanSeeCards: true,
      othersCanSeeCards: true,
      maxCardsAllowed: undefined,
    };
    /**
     * User definable fn for when a card is received if events were setup on the area
     * @param e
     */
    this.handleCardReceived = (e) => {
      // console.log('dom added to area', e);
      // find the card object & do something?
    };
    /**
     * User definable fn for when a card is removed if events were setup on the area
     * @param e
     */
    this.handleCardRemoved = (e) => {
      console.log('dom removed from area', e);
    };
    this.events = {};
    this.stackVertical = newOptions.stackVertical;
    // this.maxCardsInVertical = newOptions.maxCardsInVertical || 12;
    // this.maxColumnsForVertical = newOptions.maxColumnsForVertical || 7;
    // this.stackHorizontal = newOptions.stackHorizontal;
    this.maxCardsInHorizontal = newOptions.maxCardsInHorizontal || 0;
    // this.maxRowsForHorizontal = newOptions.maxRowsForHorizontal || 0;
    this.flexArea = newOptions.flexArea;
    this.dealCenterLine = newOptions.dealCenterLine;

    this.dom = undefined;

    this.getAreaPosition();
  }

  /**
   * Find area position in the dom
   */
  getAreaPosition() {
    let domArea = document.getElementById(this.elementId);
    this.dom = domArea;
    let playerBox = domArea.getBoundingClientRect();

    this.position.top = playerBox.top - this.siteElementOffsets.top;
    this.position.right = playerBox.right - this.siteElementOffsets.right;
    this.position.bottom = playerBox.bottom - this.siteElementOffsets.bottom;
    this.position.left = playerBox.left - this.siteElementOffsets.left;
  }

  /**
   * Set the observers on an area such as when a card is added or removed
   * @returns {Area}
   */
  setObserver() {
    // Select the node that will be observed for mutations
    const targetNode = this.dom;

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationsList, observer) => {
      // Use traditional 'for loops' for IE 11
      for (let mutation of mutationsList) {
        // console.log(mutation);
        if (mutation.type === 'childList') {
          if (mutation.addedNodes.length > 0) {
            // console.log('A child node has been added.', mutation.addedNodes);
            mutation.addedNodes.forEach(async (item) => {
              // console.log('childNode', item)
              await this.onCardReceived(item);
            });
          }
          if (mutation.removedNodes.length > 0) {
            // console.log('A child node has been removed.');
            mutation.removedNodes.forEach(async (item) => {
              // console.log('childNode', item)
              await this.onCardRemoved(item);
            });
          }
        } else if (mutation.type === 'attributes') {
          console.log(
            'The ' + mutation.attributeName + ' attribute was modified.'
          );
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    // // Later, you can stop observing
    // observer.disconnect();
    return this;
  }

  /**
   * Internal call made by {@link Area#setObserver} when a card has been added to the area
   * @async
   * @param card
   * @returns {Promise<{someVal: string}>}
   */
  async onCardReceived(card) {
    // console.log('Area.onCardReceived', card)
    await this.handleCardReceived(card);

    return Promise.resolve({ someVal: 'onCardReceived done' });
  }

  /**
   * Internal call made by {@link Area#setObserver} when a card has been removed from the area
   * @async
   * @param card
   * @returns {Promise<{someVal: string}>}
   */
  async onCardRemoved(card) {
    // console.log('Area.onCardRemoved', card)
    await this.handleCardRemoved(card);

    return Promise.resolve({ someVal: 'onCardRemoved done' });
  }
}

export default Area;
