// ------------ Constants ------------
const DECK_OF_CARDS = document.querySelector('.deck');
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
/** Total number of cards to match for successfully matching, must be minimum 2.
 * eg. if it's set to 4 then Player must select 4 cards with exact same symbol for
 * correctly matching
*/
let totalCardsToMatchForSinglePair = 2; // min: 2, max: 5
/** total number of cards to play (maximum 60), must be multiplication of
 * totalCardsToMatchForSinglePair and n, where n must be minimum 2.
 *
 * eg, if totalCardsToMatchForSinglePair = 4
 * then totalCards must be one number from the following list
 *
 * [4x2, 4x3, 4x4,..., 4x12, 4x13, 4x14]
 * which is
 * [8, 12, 16,...,48, 52, 58]
 * */
let totalCards = 16; // min: 4, max: 60
// check if given total cards
checkForTotalCards();



// ------------- Functions -------------
/**
 * Creates Deck of cards (or rather symbols)
 */
function createDeck(){
    // t0 = performance.now(); // to test performance
    const docFragment = document.createDocumentFragment(); // document fragment for performance purpose
    let li = '';
    let i = '';
    // TODO: Change hardcoded value 16 to any number in bellow for loop,
    // which is >= 4 dynamically for level system or from user input.
    for (let x=0; x < 16; x++) {
        li = document.createElement('li');
        li.classList.add('card');
        i = document.createElement('i');
        i.classList.add('fas'); // Add class for font awesome library 'fas' for solid & 'far' for regular icons
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
    let currentIndex = arr.length;
    let tempValue;
    let randomIndex;

    while(currentIndex !== 0) {
        randomIndex = Math.floor(Math.random * currentIndex); //generates random integer from 0 to currentIndex
        currentIndex -=1;
        tempValue = arr[currentIndex]; // save currentIndex value as temp value
        arr[currentIndex] = arr[randomIndex]; // sets generated random index's value as current index's
        arr[randomIndex] = tempValue; // sets saved temp value(which was current index's value) to random index
    }

    return arr;
}


/**
 *  Checks  if totalCards variable has valid value or not
 */
function checkForTotalCards () {
    console.log('total cards: ' + totalCards);
    if (totalCards < totalCardsToMatchForSinglePair * 2) {
        console.log('setting minimum value for totalCards, value not set according to rule.');
        totalCards = totalCardsToMatchForSinglePair * 2;
        console.log('new total cards: ' + totalCards);
    } else {
        let remainder = totalCards % totalCardsToMatchForSinglePair;
        if (remainder !== 0) {
            console.log('changing value of totalCards, value not set according to rule.');
            while (remainder !== 0) {
                totalCards--;
                remainder = totalCards % totalCardsToMatchForSinglePair;
            }
            console.log('new total cards: ' + totalCards);
        }
    }
}
