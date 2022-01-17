/** Constants */
const DECK_OF_CARDS = document.querySelector('.deck');

/** variables */



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