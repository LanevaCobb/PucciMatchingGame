/*
 * Create a list that holds all of your cards
 */

var cards = ['fa-diamond', 'fa-diamond',
              'fa-paper-plane-o', 'fa-paper-plane-o',
              'fa-anchor', 'fa-anchor',
              'fa-bolt', 'fa-bolt',
              'fa-cube', 'fa-cube',
              'fa-leaf', 'fa-leaf',
              'fa-bicycle','fa-bicycle',
              'fa-bomb','fa-bomb',
            ];

function createCard(card) {
      return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}



/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
//Adds event listener for all the cards
var timer = document.querySelector('.timer');
let starList = document.querySelectorAll('.stars li');
let flipCards = [];
var moves = 0;
var moveCount = document.querySelector('.moves');
var time = 0;
let timerInt;
let card = document.getElementsByClassName("card");
var deck = document.querySelector('.deck');
let matchedCards = document.getElementsByClassName("match");
var stars = document.querySelectorAll('.fa-star');
var close_x = document.querySelector('.close');



var cardHTML = shuffle(cards).map(function(card) {
 return createCard(card);
});

deck.innerHTML = cardHTML.join('');


//Shuffledeck from https://matthewcranford.com/memory-game-walkthrough-part-4-shuffling-decks/
function shuffleDeck() {
  const cardstoShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardstoShuffle);
  for (card of shuffledCards) {
    deck.appendChild(card);
    card.classList.remove('show', 'open', 'match');
  }
}


function initGame(){

   shuffleDeck();

   clearInterval(timerInt);

   moves = 0;
   moveCount.innerHTML = moves;

   sec = 0;
   min = 0;
   hour = 0;

   timer.innerHTML = "0 minutes 0 seconds";
   startTimer();
}

initGame();

const deckCards = document.querySelectorAll('.card');

function clickDeck(card) { deckCards.forEach(function(card) {
   card.addEventListener('click', function(event) {
     const clickTarget = event.target;

    // if card had been clicked on twice; it will not be added to the array.
     if (
       clickTarget.classList.contains('card') &&
       flipCards.length < 2 &&
       !flipCards.includes(clickTarget)
     )

     if (!card.classList.contains('open') || !card.classList.contains('show') || !card.classList.contains('match')) {
        flipCards.push(card);
        card.classList.add('open', 'show');

        if (flipCards.length == 2) {

           moveCount();
           score();

	         if (flipCards[0].dataset.card == flipCards[1].dataset.card) {
	             flipCards[0].classList.add('match');
	             flipCards[0].classList.add('open');
	             flipCards[0].classList.add('show');

	             flipCards[1].classList.add('match');
	             flipCards[1].classList.add('open');
	             flipCards[1].classList.add('show');

               flipCards = [];

          } else {

	         setTimeout(function() {
              flipCards.forEach(function(card) {
              card.classList.remove('open', 'show');
              });

              flipCards = [];
            }, 1000);
          }
          function moveCount(){
             moves++;
            var movesText = document.querySelector('.moves')
            movesText.innerHTML = moves;
          }
        }
     };
   });
 });
checkMate(); 
}
clickDeck();


function score() {
  if (moves == 12 || moves == 24) {
   clearStar();
 }
}

function clearStar() {
  for (star of starList) {
    if (star.style.display !== 'none') {
        star.style.display = 'none';
          break;
        }
    }
}



var min = 0;
var sec = 0;
var hour = 0;

function startTimer() {
  clearInterval(timerInt);
 timer_off =  false;
 timerInt = setInterval(() => {
   time++;
   timer.innerHTML = min+'minutes '+sec+'seconds';
   sec++;
   if(sec == 60){
     min++;
     sec = 0;
   }

   if(min == 60){
     hour++;
     min = 0;
   }

 }, 1000);
}


function showTime() {

  timer.innerHTML= time;
}

function stopTimer() {
  clearInterval(timerInt);
}

function reset_game() {
  initGame();
}

document.querySelector('.restart').addEventListener('click', reset_game);

function toggle_modal() {
  var modal = document.querySelector('.popup');
  modal.classList.toggle('popup_hide');

  stats();
}

toggle_modal();

function checkMate() {

  if(matchedCards.length === 16){
    gameWon();
  }
}
checkMate();


function stats() {
  const timeStat = document.querySelector('.popup_timer');
  const final_time = timer.innerHTML;
  const final_moves = document.querySelector('.popup_moves');
  const final_rating = document.querySelector('.star_rating');
  const final_stars = starList.innerHTML;

  final_moves.innerHTML = `You made ${moves} moves`;
  timeStat.innerHTML = `in ${final_time}`;
  final_rating.innerHTML = `Rating: ${final_stars}`;
}

function gameWon() {
  stopTimer();
  stats();
  toggle_modal();
}
