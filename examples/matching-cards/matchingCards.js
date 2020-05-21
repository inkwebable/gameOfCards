import { Game } from '../../src';
import { cardShuffle, dealCards } from '../../src';

export default (async () => {

  var game = new Game({
    name: 'Matching Cards',
    data: {},
    decks: [],
    dealer: {},
    players: [],
  });

  console.log('game', game);

  // const deck1 = game.createStandardDeck(1, 'matching-pears', 'js-deck', {
  //   numberOfEachCard: 1,
  //   cardSuits: { 'hearts': 'red', 'clubs': 'black', 'diamonds': 'red', 'spades': 'black' },
  //   cardValues: { A: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 11, Q: 12, K: 13 },
  //   cheat: true
  // });

  //create a custom deck
  const pears = game.createStandardDeck(1, 'matching-pears', 'js-deck', {
    numberOfEachCard: 2,
    cardSuits: { "pear": 'green' },
    cardValues: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 },
    imagePath: "images/game-of-cards/pear-cards",
    imageExt: 'png',
    cheat: true
  }, 'matching');

  // const arabia = game.createDeck(1, 'matching-pears', 'js-deck', {
  //   numberOfEachCard: 2,
  //   useSuits: false,
  //   addValues: true,
  //   // imageNames: ['alif', 'baa', 'taa'],
  //   cardValues: { 'alif': 1, 'baa': 2, 'taa': 3 },
  //   imagePath: "images/game-of-cards/arabic-cards",
  //   cheat: true
  // }, 'matching');

  game.createDealer('dealer1', 'AI Dealer', {})
    .createHand('dealer1')
    .createArea('js-deck', 'deck', { owner: 'dealer', stackVertical: false });

  game.createPlayer('player1', 'Thien', {})
    .createHand('hand1', {
      data: {
        clickCount: 0,
        matchedPairs: 0,
        matchedIds: [],
        flipped: [],
      },
      rules: {
        timeToMemorise: 300,
        allowFlip: true,
        pairsToMatch: 6
      }
    })
    .createArea('hand1', 'area1', {
      flexArea: true, // turning this off makes cards position absolute, so must set maxCardsInHorizontal
      stackVertical: false, // override flex area
      maxCardsInHorizontal: 3, // overridden if flexArea
      dealCenterLine: false,
    })
    .setObserver();

  // can pass deck ids to each of these methods
  game.shuffleDeckCards().makeDomMarkUp().addDeckToDom();
  game.assignCardDomToCardObj();

  game.dealer.hand.addCardsToHand(game.findDeckById(1).cards);

  let handleCardClick = function onCardClick(data, evt) {

    let hand, card;

    console.log('onCardClick', this, data, evt);
    if (data.hasOwnProperty('card')) {
      card = data.card
      hand = this;
    } else {
      card = this;
      hand = data.hand
    }

    // should allowflip be on the deck or the game or the hand?
    if (card.allowFlip === true && !card.transitioning) {

      if (Object.keys(hand.data.flipped).length < 2) {

        if (!hand.data.flipped.hasOwnProperty(card._id)) {

          hand.data.clickCount++;
          // console.log(hand.data.clickCount);

          if (card.flipCardFaceUp()) {
            hand.data.flipped[card._id] = card;
          } else {
            alert('flipCardFaceUp is false');
            card.flipCardFaceDown();
          }
        } else {
          // @TODO remove
          console.log('card already flipped', hand.data.flipped.hasOwnProperty(card._id));
        }
      }

    } else {
      // @TODO remove
      console.log('card not flippable or is transitioning', card);
    }
  }

  let afterCardFlipUp = function onCardFlipUp(data, evt) {
    console.log('afterCardFlipUp', this, data, evt);

    let card, hand;

    if (data.hasOwnProperty('card')) {
      card = data.card
      hand = this;
    } else {
      card = this;
      hand = data.hand
    }

    if (Object.keys(hand.data.flipped).length >= 2 && hand.allCardsTransitioned()) {
      // console.log('2 cards in flipped', hand.data.flipped, hand.data.timeToMemorise);

      hand.rules.allowFlip = false;

      setTimeout(() => {

        if (cardsMatch(hand)) {

          // remove events and add matched class name to cards
          for (let matchedCard in hand.data.flipped) {
            hand.data.flipped[matchedCard].addDOMClassContainer('matched');
            hand.data.flipped[matchedCard].clearClickListener();
            hand.data.flipped[matchedCard].clearTransitionedListener();
          }

          // update & reset game & deck values
          hand.data.matchedPairs += 1;

          hand.data.flipped = {};
          hand.rules.allowFlip = true;

          // check if player won the game @TODO make this = to the length of cards
          console.log('if won', game);
          if (hand.data.matchedPairs === hand.rules.pairsToMatch) {
            playerWon(hand);
          }

        } else {
          // flip cards back
          for (let cardObjId in hand.data.flipped) {
            console.log('flipped', hand.data.flipped[cardObjId]);
            hand.data.flipped[cardObjId].flipCardFaceDown();
          }

          hand.data.flipped = {};
          hand.rules.allowFlip = true;
        }

      }, hand.rules.timeToMemorise);
    }

  }

  let afterCardFlipDown = function onCardFlipDown(data, evt) {

    console.log('afterCardFlipDown', this, data, evt);

    let card, hand;

    if (data.hasOwnProperty('card')) {
      card = data.card
      hand = this;
    } else {
      card = this;
      hand = data.hand
    }

    // @TODO check this
    console.log('deleting from hand.data.flipped ' + card._id);
    delete hand.data.flipped[card._id];
  }

  function cardsMatch(hand) {

    console.log('do cards match', hand.data.flipped, hand.data.matchedIds);
    // right amount of cards to test against?
    if (Object.keys(hand.data.flipped).length >= 2) {

      // check if cards are new matches
      if (hand.data.matchedIds.indexOf(hand.data.flipped[Object.keys(hand.data.flipped)[0]].name) === -1 && hand.data.matchedIds.indexOf(hand.data.flipped[Object.keys(hand.data.flipped)[1]].name) === -1) {

        // do they match?
        if (hand.data.flipped[Object.keys(hand.data.flipped)[0]].name === hand.data.flipped[Object.keys(hand.data.flipped)[1]].name) {

          // move card ids to winner array or object
          hand.data.matchedIds.push(hand.data.flipped[Object.keys(hand.data.flipped)[0]]._id);
          hand.data.matchedIds.push(hand.data.flipped[Object.keys(hand.data.flipped)[1]]._id);

          return true;
        }
      }
      // @TODO check when id of flipped match is equal to the flipped object name ie. 6
      console.log('no match', game, hand.data.flipped, hand.data.flipped[Object.keys(hand.data.flipped)[0]].name, hand.data.flipped[Object.keys(hand.data.flipped)[1]].name);
      return false;
    }
    alert('not enough cards flipped');
    return false;
  }

  function playerWon(hand) {
    console.log('Called playerWon', game);
    // let removed = game.findPlayerById('player1').hand.removeCardEvents();
    // console.log('removed', removed);

    if (hand.data.matchedPairs === hand.rules.pairsToMatch) {
      let addToBoard = confirm(`You finished the game in ${hand.data.clickCount} clicks, add to score board?`);

      if (addToBoard === true) {
        let player = prompt('Please enter your name');
        if (player === '') {
          player = "Unknown Player";
        }

        let xhr;
        if (window.XMLHttpRequest) {
          xhr = new XMLHttpRequest();
        } else {
          xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        let url = "matching-pairs/add-score";
        let params = `score=${hand.data.clickCount}&name=${player}&pair_amount=${hand.data.matchedPairs}`;

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("success");
            // setTimeout(function () {
            //     location.reload();
            // }, 1000);

          } else {
            console.log("failed to send request");
            // options
            // give player button to try again
            // add score to storage and allow player to try again ( player can cheat )
            // store score in session
            // send score, name etc to a google docs sheet?
          }
        };
        xhr.send(params);

      } else {
        // @TODO reset game?
      }
    }
  }

  // add event when card is added to hand (don't use arrow function to gain access to this)
  // game.findPlayerById('player1').hand.handleCardAdded = (card, hand) => {
  //   // console.log('thiss', this);
  //   // card.setClickEvent((data, evt) => {
  //   //   console.log('card', card, 'hand',hand, 'this', this);
  //   //   console.log('params',data, evt);
  //   // }, { hand });
  //   hand.rules.pairsToMatch = (hand.cards.length / 2) // @TODO see if there is a way to set this by finding out how many cards were dealt to player?
  //
  //   card.setClickEvent(handleCardClick, { hand });
  //   card.setTransitionEvent({ onCardFaceUp: afterCardFlipUp, onCardFaceDown: afterCardFlipDown }, { hand });
  // };

  // game.findPlayerById('player1').hand.handleCardAdded = function(card) {
  //   let hand = this;
  // }

  await cardShuffle(game.dealer.hand.cards, () => {
    console.log('cardShuffle cb')
  }).then((data) => {
    console.log('cardShuffle then', data);
  });

  // Move one card
  // let card = game.dealer.hand.getLastCard();
  // console.log('card', card);
  // let test = await animateCardFromOneAreaToAnother(
  //   game.dealer.hand,
  //   game.findPlayerByName('Thien').hand,
  //   card
  // )
  //   .then((obj) => {
  //     console.log('moveCardFromOneAreaToAnother obj', obj);
  //     game.findPlayerByName('Thien').hand.cards.push(card);
  //     game.dealer.hand.cards.pop();
  //     return obj;
  //   });
  // console.log('moveCardFromOneAreaToAnother test', test)

  // @TODO get dealer fn?
  let totalCards = game.dealer.hand.cards.length;

  let dealerTest = await dealCards(
    game.dealer,
    [
      game.findPlayerByName('Thien'),
      // game.findPlayerByName('Thien2')
    ], {
      totalCardsToDeal: totalCards, // ignored if perPlayer is set
      // perPlayer: 2, // overrides totalCardsToDeal
      sequential: true, // deal sequentially
      inlineFlex: true
    });
  console.log('dealerTest', dealerTest);

  // add card events to hand  - must be done when hand has cards, i.e after being deal cards or receiving cards
  // game.findPlayerByName('Thien2').hand.setCardClickFn(handleCardClick);
  // game.findPlayerByName('Thien2').hand.setTransitionEvent({
  //   onCardFaceUp: afterCardFlipUp,
  //   onCardFaceDown: afterCardFlipDown
  // });

  // do listeners later
  game.findPlayerByName('Thien').hand.setCardClickFn(handleCardClick, false);
  game.findPlayerByName('Thien').hand.setAfterCardFaceUpFn(afterCardFlipUp, false);
  game.findPlayerByName('Thien').hand.setAfterCardFaceDownFn(afterCardFlipDown, false);
  game.findPlayerByName('Thien').hand.setUpCardEvents();

  console.log('test');
})();
