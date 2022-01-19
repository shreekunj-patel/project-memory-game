// ------------ Constants ------------
// Score Panel
const SCORE_PANEL = document.body.querySelector('.score-panel');
const STARS = SCORE_PANEL.querySelector('.stars');
const RESET = SCORE_PANEL.querySelector('.restart');
const MOVES = SCORE_PANEL.querySelector('.moves');
const MAX_STAR_RATING = 5;
// Winning Message
const WIN_MESSAGE = document.body.querySelector('.win-message');
const WIN_STARS = WIN_MESSAGE.querySelector('.final-star');
const WIN_MOVES = WIN_MESSAGE.querySelector('.final-moves');
const PLAY_AGAIN = WIN_MESSAGE.querySelector('.play-again');
// Deck of Cards
const DECK_OF_CARDS = document.body.querySelector('.deck');
const CARD_SYMBOLS = [
    'fa-gem',
    'fa-paper-plane',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-leaf',
    'fa-bicycle',
    'fa-bomb',
];

// ------------ Variables -----------
let matchedCardsCount = 0;
let totalMoves = 0;
let extraMoves = 0; // wasted moves for calculating star rating
let currentStarRating = MAX_STAR_RATING;

/** Total number of cards to match for successfully matching, must be minimum 2.
 * eg. if it's set to 4 then Player must select 4 cards with exact same symbol for
 * correctly matching
*/
let totalCardsForSinglePair = 2; // min: 2, max: 5

/** total number of cards to play (maximum 60), must be multiplication of
 * totalCardsForSinglePair and n, where n must be minimum 2.
 *
 * eg, if totalCardsForSinglePair = 4
 * then totalCards must be one number from the following list
 *
 * [4x2, 4x3, 4x4,..., 4x12, 4x13, 4x14]
 * which is
 * [8, 12, 16,...,48, 52, 58]
 * */
let totalCards = 16; // min: 4, max: 60
// check if given total cards are valid or not.
checkForTotalCards();

// change multiplication value to adjust star rating.
// higher the value easier it is to acquire 5 stars.
const MOVES_TO_DECREASE_STAR = Math.round(totalCardsForSinglePair * 1.5);

// ------------- Listeners --------------
RESET.addEventListener('click', resetGame);
DECK_OF_CARDS.addEventListener('click', main);



// ------------- Functions -------------
/**
 * Creates Deck of cards (or rather symbols)
 */
function createDeck() {
    // t0 = performance.now(); // to test performance
    const docFragment = document.createDocumentFragment(); // document fragment for performance purpose
    let cards = createCardArray();
    cards = shuffle(cards);
    let li = '';
    let i = '';
    // TODO: Change hardcoded value 16 to any number in bellow for loop,
    // which is >= 4 dynamically for level system or from user input.
    for (let index = 0; index < 16; index++) {
        li = document.createElement('li');
        li.classList.add('card');
        i = document.createElement('i');
        i.classList.add('fas'); // Add class for font awesome library 'fas' for solid & 'far' for regular icons
        console.log(cards[index]);
        i.classList.add(cards[index]);
        li.append(i);
        docFragment.append(li);
        //docFragment.lastElementChild.append(i);
    }
    DECK_OF_CARDS.innerHTML = ''; // Clears existing Cards before adding it again.
    DECK_OF_CARDS.append(docFragment); // Adds Cards to the deck
    // t1 = performance.now(); // to test performance
    // console.log(t1-t0 + 'ms'); // to test performance
}


/**
 * Shuffles given array.
 *
 * from http://stackoverflow.com/a/2450976
 * @param {array} arr
 */
function shuffle(arr) {
    console.log('Before shuffle:\n' + arr);
    let currentIndex = arr.length;
    let tempValue;
    let randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex); //generates random integer from 0 to currentIndex
        currentIndex -= 1;
        tempValue = arr[currentIndex]; // save currentIndex value as temp value
        arr[currentIndex] = arr[randomIndex]; // sets generated random index's value as current index's
        arr[randomIndex] = tempValue; // sets saved temp value(which was current index's value) to random index
    }
    console.log('After shuffle:\n' + arr);
    return arr;
}


/**
 *  Checks  if totalCards variable has valid value or not
 */
function checkForTotalCards() {
    console.log('total cards: ' + totalCards);
    if (totalCards < totalCardsForSinglePair * 2) {
        console.log('setting minimum value for totalCards, value not set according to rule.');
        totalCards = totalCardsForSinglePair * 2;
        console.log('new total cards: ' + totalCards);
    } else {
        let remainder = totalCards % totalCardsForSinglePair;
        if (remainder !== 0) {
            console.log('changing value of totalCards, value not set according to rule.');
            while (remainder !== 0) {
                totalCards--;
                remainder = totalCards % totalCardsForSinglePair;
            }
            console.log('new total cards: ' + totalCards);
        }
    }
}


/**
 * Creates card array from symbols array.
 * @returns {Array}
 */
function createCardArray() {
    let cards = [];
    if (CARD_SYMBOLS.length != totalCards / totalCardsForSinglePair) {
        console.log(CARD_SYMBOLS.length);
        console.log(totalCards / totalCardsForSinglePair);
    } else {
        cards = CARD_SYMBOLS.concat(CARD_SYMBOLS);
        for (let i = 2; i < totalCardsForSinglePair; i++) {
            cards = cards.concat(CARD_SYMBOLS);
        }
    }
    console.log(cards);
    return cards;
}


/**
 * main function.
 * @param {Event} evt for getting node name.
 */
function main(evt) {
    if (evt.target.nodeName.toLowerCase() === 'li') {
        // only run code if card is neither open nor match
        if (!(evt.target.classList.contains('open') || evt.target.classList.contains('match'))) {
            // Opens and shows card which is clicked
            evt.target.classList.add('open');
            evt.target.classList.add('show');
            // list of all li which contains 'open' and 'show' class
            let liList = DECK_OF_CARDS.querySelectorAll('.open.show');

            if (liList.length === totalCardsForSinglePair) {
                // Add a move.
                totalMoves += 1;
                MOVES.textContent = totalMoves;
                console.log('opened ' + totalCardsForSinglePair + ' cards');
                //before checking for matching cards remove event listener and then add it back.
                setTimeout(() => {
                    DECK_OF_CARDS.removeEventListener('click', main);
                    console.log('Event listener removed');
                }, 0);
                // check for matching cards
                setTimeout(() => {
                    // check if pair found or not.
                    if (liList[0].firstElementChild.className === liList[1].firstElementChild.className) {
                        console.log('Congrats you found a pair');
                        // add all matched cards to matchedCardsCount
                        matchedCardsCount += totalCardsForSinglePair;
                        liList.forEach((li) => {
                            li.className = 'card match'; // removes 'open' and 'show' class and adds 'match' class
                            // li.classList.add('match');
                            // li.classList.remove('open');
                            // li.classList.remove('show');
                        });
                        // if all cards matched display Winning Message
                        if (gameWon()) {
                            setTimeout(() => {
                                displayWinGameMsg();
                            }, 300);
                        }

                    } else {
                        extraMoves += 1;
                        // Calculate Star rating
                        createStarRating();
                        console.log('closing cards cause it\'s not same');
                        liList.forEach((li) => {
                            li.className = 'card'; // removes 'open' and 'show' class
                            //li.classList.remove('open');
                            //li.classList.remove('show');
                        });
                    }
                }, 750);
                // add back event listener, only if gameWon = false.
                if (!(gameWon())) {
                    setTimeout(() => {
                        DECK_OF_CARDS.addEventListener('click', main);
                        console.log('Event listener added');
                    }, 1000);
                }
            }
        }
    }
}


/**
 *  Create Star Rating for score panel.
 */
function createStarRating() {
    if (extraMoves % MOVES_TO_DECREASE_STAR === 0 && currentStarRating > 1) {
        /** for resetting  purpose */
        currentStarRating = (totalMoves === 0) ? MAX_STAR_RATING : --currentStarRating;
        const docFragment = document.createDocumentFragment();
        let li = '';
        let i = '';
        for (let index = 0; index < MAX_STAR_RATING; index++) {
            li = document.createElement('li');
            i = document.createElement('i');
            /**
             *  Add class for font awesome library
             * 'fas' for font awesome solid icons
             * 'far' for font awesome regular icons
             *
             */
            let fasOrFar = (index < currentStarRating) ? 'fas' : 'far';
            i.classList.add(fasOrFar);
            i.classList.add('fa-star');
            i.classList.add('fa-xs');
            li.append(i);
            docFragment.append(li);
            //docFragment.lastElementChild.append(i);
        }
        STARS.innerHTML = ''; // Clears existing Star Rating before adding it again.
        STARS.append(docFragment); // Adds Star rating to the score panel
    }

}


/**
 *  Restart | Reset | Play Again
 */
function resetGame(evt) {
    totalMoves = 0; // reset total moves
    MOVES.textContent = totalMoves; // reset Moves display
    extraMoves = 0; // reset extra moves
    currentStarRating = MAX_STAR_RATING; // reset star rating
    createStarRating(); // reset star rating display
    createDeck();
}


function displayWinGameMsg() {
    // Remove event listeners for any Element which is not going to display in Win-Game-Message.
    setTimeout(() => {
        RESET.removeEventListener('click', resetGame);
        DECK_OF_CARDS.removeEventListener('click', main);
    }, 0);

    const docFragment = document.createDocumentFragment();
    // add total moves and current star rating in win message
    WIN_STARS.innerHTML = currentStarRating;
    WIN_MOVES.innerHTML = totalMoves;
    // add tabIndex to Play again so it becomes keyboard focusable
    PLAY_AGAIN.tabIndex = 0;

    // hide game screen(deck) and score panel
    SCORE_PANEL.style.display = 'none';
    SCORE_PANEL.hidden = true;
    DECK_OF_CARDS.style.display = 'none';
    DECK_OF_CARDS.hidden = true;
    // show winning message
    WIN_MESSAGE.style.display = '';
    WIN_MESSAGE.hidden = false;

    // add event listener to Play again button
    // PLAY_AGAIN.addEventListener('click', resetGame);
}


function gameWon() {
    return (matchedCardsCount === totalCards);
}