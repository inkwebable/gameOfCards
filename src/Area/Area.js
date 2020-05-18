class Area {
  constructor(id, name, options) {
    const defaultOptions = {
      name: 'area',
      id: 'js-area',
      owner: 'board',
      placeHolders: {},
      stackCardsOnTop: false,
      stackVertical: false,
      maxCardsInVertical: 12,
      maxColumnsForVertical: 7,
      stackHorizontal: false,
      maxCardsInHorizontal: 0,
      maxRowsForHorizontal: 0,
      flexArea: true,
      autoStack: false,
    }

    const newOptions = Object.assign({}, defaultOptions, options);
    Object.defineProperties(this, {
      'id': {
        value: id,
        writable: false,
      },
    });

    this.name = name;
    // this.id = newOptions.id || 'js-area';
    this.owner = newOptions.owner || 'board';
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
      left: 0
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
    this.handleCardReceived = (e) => {
      // console.log('dom added to area', e);
      // find the card object & do something?
    };
    this.handleCardRemoved = (e) => {console.log('dom removed from area',e)};
    this.events = {}
    this.stackVertical = newOptions.stackVertical;
    // 0 we assume area is a flex container
    this.maxCardsInVertical = newOptions.maxCardsInVertical || 12;
    // 0 we assume area is a flex container
    this.maxColumnsForVertical = newOptions.maxColumnsForVertical || 7;
    // 0 we assume area is a flex container
    this.stackHorizontal = newOptions.stackHorizontal;
    // 0 we assume area is a flex container
    this.maxCardsInHorizontal = newOptions.maxCardsInHorizontal || 0;
    // 0 we assume area is a flex container
    this.maxRowsForHorizontal = newOptions.maxRowsForHorizontal || 0;
    // for flex area to work cards must not have absolute position
    this.flexArea = newOptions.flexArea;
    this.autoStack = newOptions.autoStack;

    this.dom = undefined;

    this.getAreaPosition();
  }

  // find deck placement in dom using getBoundingClientRect()
  getAreaPosition() {

    let domArea = document.getElementById(this.id);
    this.dom = domArea;
    let playerBox = domArea.getBoundingClientRect();

    this.position.top = playerBox.top - this.siteElementOffsets.top;
    this.position.right = playerBox.right - this.siteElementOffsets.right;
    this.position.bottom = playerBox.bottom - this.siteElementOffsets.bottom;
    this.position.left = playerBox.left - this.siteElementOffsets.left;
    console.log('getAreaPosition',this.id, this.position, domArea)
  }

  setObserver() {
    // Select the node that will be observed for mutations
    const targetNode = this.dom;

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationsList, observer) => {
      // Use traditional 'for loops' for IE 11
      for(let mutation of mutationsList) {
        // console.log(mutation);
        if (mutation.type === 'childList') {
          if(mutation.addedNodes.length > 0) {
            // console.log('A child node has been added.', mutation.addedNodes);
            mutation.addedNodes.forEach(async (item) => {
              // console.log('childNode', item)
              await this.onCardReceived(item);
            });
          }
          if(mutation.removedNodes.length > 0) {
            // console.log('A child node has been removed.');
            mutation.removedNodes.forEach(async item => {
              // console.log('childNode', item)
              await this.onCardRemoved(item);
            });
          }
        }
        else if (mutation.type === 'attributes') {
          console.log('The ' + mutation.attributeName + ' attribute was modified.');
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

  // detect click, if card, track
  // addEvents() {
  //   this.dom.addEventListener('')
  // }

  async onCardReceived (card) {
    console.log('Area.onCardReceived', card)
    await this.handleCardReceived(card);

    return Promise.resolve({ someVal : 'onCardReceived done'});
  }

  async onCardRemoved(card) {
    console.log('Area.onCardRemoved', card)
    await this.handleCardRemoved(card);

    return Promise.resolve({ someVal : 'onCardRemoved done'});
  }

  assignEvent(type) {

  }

  calculateSiteElementOffsets() {
    // given ids or class, calculate offsets
  }

}

export default Area;
