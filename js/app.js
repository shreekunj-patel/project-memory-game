// ------------ Constants ------------
const RESET = document.querySelector('.restart');
const DECK_OF_CARDS = document.querySelector('.deck');
const MOVES = document.querySelector('.moves');
const STARS = document.querySelector('.stars');
const TOTAL_STAR_RATING = 5;
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
let totalMoves = 0;
let extraMoves = 0; // wasted moves for calculating star rating
let starRating = 5;
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

const MOVES_TO_DECREASE_STAR = Math.round(totalCardsToMatchForSinglePair * 1.5); // change multiplication value

// ------------- Listeners --------------
RESET.addEventListener('click', createDeck);
DECK_OF_CARDS.addEventListener('click', main);



// ------------- Functions -------------
/**
 * Creates Deck of cards (or rather symbols)
 * @param {Event} evt
 */
function createDeck(evt){
    // t0 = performance.now(); // to test performance
    totalMoves = 0; // reset total moves
    MOVES.textContent = totalMoves;
    const docFragment = document.createDocumentFragment(); // document fragment for performance purpose
    let cards = createCardArray();
    cards = shuffle(cards);
    let li = '';
    let i = '';
    // TODO: Change hardcoded value 16 to any number in bellow for loop,
    // which is >= 4 dynamically for level system or from user input.
    for (let index=0; index < 16; index++) {
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

    while(currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex); //generates random integer from 0 to currentIndex
        currentIndex -=1;
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


function createCardArray() {
    let cards = [];
    if (CARD_SYMBOLS.length != totalCards / totalCardsToMatchForSinglePair) {
        console.log(CARD_SYMBOLS.length);
        console.log(totalCards / totalCardsToMatchForSinglePair);
    } else {
        cards = CARD_SYMBOLS.concat(CARD_SYMBOLS);
        for (let i=2; i<totalCardsToMatchForSinglePair; i++) {
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
            // Add a move.
            totalMoves += 1;
            MOVES.textContent = totalMoves;
            extraMoves += 1;
            // Opens and shows card which is clicked
            evt.target.classList.add('open');
            evt.target.classList.add('show');
            //before checking for matching cards remove event listener and then add it back.
            // DECK_OF_CARDS.removeEventListener('click', main);
            let remainder = totalMoves % totalCardsToMatchForSinglePair;
            if (remainder === 0) {
                console.log('opened ' + totalCardsToMatchForSinglePair + ' cards');
                setTimeout(() => {
                    DECK_OF_CARDS.removeEventListener('click', main);
                    console.log('Event listener removed');
                }, 0);
                setTimeout(() => {
                    // list of all li which contains 'open' and 'show' class
                    let liList = DECK_OF_CARDS.querySelectorAll('.open.show');
                    if (liList[0].firstElementChild.className === liList[1].firstElementChild.className) {
                        console.log('Congrats you found a pair');
                        liList.forEach((li) => {
                            li.className = 'card match'; // removes 'open' and 'show' class and adds 'match' class
                            // li.classList.add('match');
                            // li.classList.remove('open');
                            // li.classList.remove('show');
                        });
                    } else {
                        console.log('closing cards cause it\'s not same');
                        liList.forEach((li) => {
                            li.className = 'card'; // removes 'open' and 'show' class
                            //li.classList.remove('open');
                            //li.classList.remove('show');
                        });
                    }
                }, 750);
                setTimeout(() => {
                    DECK_OF_CARDS.addEventListener('click', main);
                    console.log('Event listener added');
                }, 1000);
            }
            // DECK_OF_CARDS.addEventListener('click', main);
        }
    }
}


function calculateStarRating() {
    if (extraMoves % MOVES_TO_DECREASE_STAR === 0 && starRating > 0) {
        starRating -= 1;
        const docFragment = document.createDocumentFragment();
        for (let j=0; j<TOTAL_STAR_RATING; j++) {
            let li = document.createElement('li');
            let i = document.createElement('i');
            if (j <= starRating) {
                i.className = 'fas fa-star fa-xs'; // here's 'fas' for 'font awesome solid' star
            } else {
                i.className = 'far fa-star fa-xs'; // here's 'far' for 'font awesome regular' star
            }
            li.append(i);
        }
        docFragment.append(li);

    }

}