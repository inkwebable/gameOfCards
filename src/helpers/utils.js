/**
 * SetTimeout promise
 *
 * @function
 * @param ms {number} - in ms
 * @returns {Promise<unknown>}
 */
export const wait = ms => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Shuffle the cards
 *
 * @async
 * @function
 * @param cards {Cards[]}
 * @param callback {function}
 * @param {object} [options={index: 0, delay: 500}] - options
 * @param  {number} [options.index=0]
 * @param  {number} [options.delay=500]
 * @returns {Promise<{data: number}>}
 */
export const cardShuffle = async (cards = [], callback = () => {}, options = {}) => {
  let defaultOptions = { index: 0, delay: 500 };
  let { index, delay } = Object.assign({}, defaultOptions, options);

  await wait(delay);

  while (index <= (cards.length - 2)) {
    let cardObj1 = cards[index]
    let cardObj2 = cards[index + 1]

    let card1 = cardObj1.dom
    let card2 = cardObj2.dom

    card1.className = 'goc-card-container shuffle-left';
    // card1.style.zIndex =  (index + 1);

    if (card2) {
      // console.log('card2', card2);
      card2.className = 'goc-card-container shuffle-right';
      // card2.style.zIndex = index;
    }

    await wait(100);

    card1.className = 'goc-card-container shuffle-right';
    if (card2) {
      card2.className = 'goc-card-container shuffle-left';
      swapDomElements(card1, card2);
      let temp = cardObj1;
      cards[index] = cardObj2
      cards[index + 1] = temp;
    }

    index += 2;
  }

  // a delay to avoid conflicts (e.g with deal fn )
  await wait(1000);

  callback();
  // console.log('index', index);
  return Promise.resolve({ data: index });
}

/**
 *
 * @function
 * @param obj1 {HTMLElement}
 * @param obj2 {HTMLElement}
 */
export const swapDomElements = (obj1, obj2) => {
  // save the location of obj2
  var parent2 = obj2.parentNode;
  var next2 = obj2.nextSibling;
  // special case for obj1 is the next sibling of obj2
  if (next2 === obj1) {
    // just put obj1 before obj2
    parent2.insertBefore(obj1, obj2);
  } else {
    // insert obj2 right before obj1
    obj1.parentNode.insertBefore(obj2, obj1);

    // now insert obj1 where obj2 was
    if (next2) {
      // if there was an element after obj2, then insert obj1 right before that
      parent2.insertBefore(obj1, next2);
    } else {
      // otherwise, just append as last child
      parent2.appendChild(obj1);
    }
  }
}

/**
 * Move card from one {@link Area} to another
 *
 * @function
 * @param fromHand {Hand}
 * @param toHand {Hand}
 * @param card {Card}
 * @param options
 * @returns {Promise<{data: string}>}
 */
export const animateCardFromOneAreaToAnother = async (fromHand, toHand, card, options) => {
  let defaultOptions = { speed: 300, inlineFlex: false, moveCardObjects: false };
  let { speed, inlineFlex, moveCardObjects } = Object.assign({}, defaultOptions, options);

  const styles = window.getComputedStyle(card.dom);
  let cardWidth = card.dom.offsetWidth + (parseFloat(styles.marginLeft) + parseFloat(styles.marginRight));
  let cardHeight = card.dom.offsetHeight + (parseFloat(styles.marginTop) + parseFloat(styles.marginBottom));
  let cardWidthOffset = toHand.cards.length * cardWidth;
  let cardHeightOffset = toHand.cards.length * (cardHeight - (cardHeight / 2));
  let stackHorizontal = toHand.area.stackHorizontal;
  let stackVertical = toHand.area.stackVertical;
  let flexArea = toHand.area.flexArea; // turn on or off flex options & position absolute/relative
  let maxCardsInHorizontal = toHand.area.maxCardsInHorizontal;
  let dealCenterLine = toHand.area.dealCenterLine;
  let row = 0;

  // auto work out the amount of cards a flex box can take
  if (flexArea && !stackVertical) {
    let width = toHand.area.dom.offsetWidth < cardWidth ? cardWidth : toHand.area.dom.offsetWidth
    maxCardsInHorizontal = Math.floor(parseInt(width, 10) / parseInt(cardWidth, 10));
    // console.log(`max in hori ${maxCardsInHorizontal}`, toHand.area.dom.offsetWidth, cardWidth, toHand.cards.length);
  }

  if (stackVertical) {
    let horizontal = (toHand.area.position.left - fromHand.area.position.left);
    let vertical = (toHand.area.position.top - fromHand.area.position.top)

    if (maxCardsInHorizontal > 0) {
      // calculate row
      row = parseInt(toHand.cards.length / maxCardsInHorizontal, 10);
      cardWidthOffset = cardWidth * (toHand.cards.length % maxCardsInHorizontal);
      horizontal += cardWidthOffset;
      vertical += (row * cardHeight) - (row > 0 ? (row * 100) : 0)
    } else {
      vertical += 0
    }

    if (dealCenterLine) {
      horizontal = (toHand.area.dom.offsetWidth / 2 - fromHand.area.position.left);
    }

    card.dom.style.position = 'absolute';
    card.dom.style.transform = `translate(${horizontal}px,${vertical}px)`;
    card.dom.style.transition = `transform ${speed}ms`;
  } else {
    // calculate row
    row = parseInt(toHand.cards.length / maxCardsInHorizontal, 10);
    cardWidthOffset = cardWidth * (toHand.cards.length % maxCardsInHorizontal);

    // when no width on flex area, must use the cardWidth as the offset and set the row to 0 until MCIH is determined
    if(flexArea && (toHand.cards.length === maxCardsInHorizontal) && cardWidthOffset === 0) {
      row = 0;
      cardWidthOffset = cardWidth * toHand.cards.length;
    }

    // get translate positioning
    let horizontal = ((toHand.area.position.left - fromHand.area.position.left) + cardWidthOffset);
    let vertical = (toHand.area.position.top - fromHand.area.position.top) + (row * cardHeight);

    // deal to the center of the toHand
    if (dealCenterLine) {
      horizontal = 0
    }

    // force styles for flex
    if (inlineFlex && flexArea) {
      if (dealCenterLine) {
        // TODO rely on user to set this?
        toHand.area.dom.style.justifyContent = 'center';
      }
      toHand.area.dom.style.display = 'flex';
      toHand.area.dom.style.flexWrap = 'wrap';
    }

    card.dom.style.position = flexArea ? 'relative' : 'absolute';
    card.dom.style.transform = `translate(${horizontal}px,${vertical}px)`;
    card.dom.style.transition = `transform ${speed}ms`;
  }

  // give transform time to finish
  await wait(speed);

  // remove class name to prevent any previous card animations
  card.dom.className = 'goc-card-container';

  // remove card from the original area and set it into the toHand area
  toHand.area.dom.appendChild(card.dom);

  // set the card into place within the area now it has been appended
  if (stackVertical) {
    card.dom.style.position = 'absolute';
    if (maxCardsInHorizontal > 0) {
      card.dom.style.transform = `translate(${cardWidthOffset}px,${(row * cardHeight) - (row > 0 ? (row * 100) : 0)}px )`;
    } else {
      card.dom.style.transform = `translate(0px,0px )`;
    }

    card.dom.style.transition = `transform ${speed}ms`;
  } else {
    card.dom.style.position = flexArea ? 'relative' : 'absolute';
    card.dom.style.transform = flexArea ? `translate(0,0)` : `translate(${cardWidthOffset}px,${(row * cardHeight)}px )`;
    card.dom.style.transition = `transform ${speed}ms`;
  }

  // move cards in hand objects
  if (moveCardObjects) {
    await fromHand.cards.removeCardFromHand(card);
    await toHand.cards.addCardToHand(card);
  }

  return Promise.resolve({ data: 'done' });
}

/**
 * Deal cards
 *
 * @function
 * @param dealer {Player}
 * @param toPlayers {Array}
 * @param options
 * @returns {Promise<{data: string}>}
 */
export const dealCards = async (dealer, toPlayers, options = {}) => {
  let defaultOptions = { totalCardsToDeal: 0, perPlayer: 0, speed: 300, sequential: false, delay: 1000, inlineFlex: false, moveCardObjects: false };
  let { totalCardsToDeal, perPlayer, speed, sequential, delay, inlineFlex, moveCardObjects } = Object.assign({}, defaultOptions, options);

  if (!dealer.hand.cards.length > 0) {
    return Promise.reject({ error: 'no cards' });
  }

  let playerLen = toPlayers.length;
  let count = 0;
  let playerIndex = 0;
  let noError = true;
  let counts = Array(playerLen).fill(0);

  if (perPlayer !== 0) {
    totalCardsToDeal = perPlayer > 0 ? perPlayer * playerLen : totalCardsToDeal;
  } else {
    perPlayer = totalCardsToDeal / playerLen;
  }

  while (count < totalCardsToDeal && dealer.hand.cards.length !== 0 && noError) {
    // get a ref to a card from the dealer
    let card = dealer.hand.getLastCard();

    await animateCardFromOneAreaToAnother(
      dealer.hand,
      toPlayers[playerIndex].hand,
      card,{
        speed,
        moveCardObjects: moveCardObjects,
        inlineFlex: inlineFlex,
      });

    // remove after moving card in dom
    await dealer.hand.removeCardFromHand(card);
    // add after moving card in dom
    await toPlayers[playerIndex].hand.addCardToHand(card);

    // track cards dealt to player(s)
    counts[playerIndex] += 1;

    if (sequential) {
      if (toPlayers[playerIndex]) {
        // go to the next player
        playerIndex = playerIndex >= (playerLen - 1) ? 0 : (playerIndex + 1);
      }
    } else {
      if (counts[playerIndex] === perPlayer) {
        // player has the required number of cards, move to next player
        playerIndex = playerIndex >= (playerLen - 1) ? 0 : (playerIndex + 1);
      }
    }

    count++;
  }

  // how do we add events to cards, specially when there are multiple hands (let the hands deal with events)
  return Promise.resolve({ data: 'done' });
}

// export const detectArea = (mouseX, mouseY, playerPos, OpponentPos, arena, deck) => {
//
//   var allareas = [playerPos, OpponentPos, arena, deck];
//   var holder = null;
//
//   for (var i = 0; i < allareas.length; i++) {
//
//     if (mouseX <= allareas[i].right && mouseX >= allareas[i].left && mouseY >= allareas[i].top && mouseY <= allareas[i].bottom) {
// //                    console.log('in area ' + allareas[i].name);
//
//       holder = allareas[i].name;
//       break;
//     } else {
//       holder = null;
//     }
//
//   }
//
//   return holder;
// }

// export const addDomEvent = (object, type, fn) => {
//   object.events[type] = fn;
//   object.events[type] = object[type].bind(object);
//   object.dom.addEventListener(type, object.events[type])
// }

// export const removeDomEvent = (object, type) => {
//   object.dom.removeEventListener(type, object.events[type])
// }
