// Global Variables
var secondsPerQuestion = 20
var time = secondsPerQuestion
var questionCounter = 0
var questions = []
var answers = []
var correct = 0
var incorrect = 0
var intervalID = ""
var audio = new Audio('./assets/Sounds/WitchCackle.mp3');



// ***********************
// Get questions using API 
function loadQuestions() {
  questions = []
  var request = new XMLHttpRequest()
  request.open('GET', 'https://opentdb.com/api.php?amount=10&category=11&type=multiple', true)
  request.onload = function () {
    var data = JSON.parse(this.response);
    console.log(data);
    data.results.forEach(question => {
      questions.push(question);
    });
  }
  request.send();
}

loadQuestions();

document.getElementById("button-play-again").addEventListener('click', function () {
  playGameAgain()
});

document.getElementById("button-begin").addEventListener('click', function () {
  playGame()
});

function playGame() {
  time = secondsPerQuestion
  intervalID = setInterval(decrementCounter, 1000)
  $('#button-begin').addClass('hide')
  $('#results').addClass('hide').css('display', 'none')
  $('#content').addClass('show').css('display', 'flex')
  correct = 0
  incorrect = 0
  displayQuestion();
}

function nextQuestion() {
  if (questionCounter < questions.length - 1) {
    $("#countdown").text(secondsPerQuestion)
    time = secondsPerQuestion;
    questionCounter++
    displayQuestion();
  } else {
    endGame()
  }
}

// This function gets the array of incorrect answers and randomly
// inserts the correct answer in that array.
// It also runs a function to decode html entities that come from the API
function displayQuestion() {
  var length = questions[questionCounter].incorrect_answers.length + 1;
  var randomNumber = (Math.floor(Math.random() * length))
  var answersArray = questions[questionCounter].incorrect_answers
  var correctAnswer = questions[questionCounter].correct_answer
  // Correct answer is logged only for demonstration purposes
  console.log("Correct Answer = ", correctAnswer)
  answersArray.splice(randomNumber, 0, correctAnswer)
  $('#countdown').removeClass('hide')
  $('#question').html(decodeResponse(questions[questionCounter].question)).removeClass("hide");
  for (var i = 0; i < answersArray.length; i++) {
    $('#answer' + (i + 1)).html(decodeResponse(answersArray[i])).removeClass("hide").addClass("show answer")
  }
  console.log(answersArray);
}

function correctAnswerHandler() {
  correct++;
  nextQuestion();
}

function incorrectAnswerHandler() {
  incorrect++;
  nextQuestion();
}

function endGame() {
  audio.play();
  setTimeout(function () {
    audio.pause();
  }, 3000);
  clearInterval(intervalID)
  $('#content').css('display', 'none')
  $('#results').removeClass('hide').addClass('show').css('display', 'flex')
  $('#results-correct').text("Correct Answers: " + correct)
  $('#results-incorrect').text("Incorrect Answers: " + incorrect)
}

function playGameAgain(){
  loadQuestions()
  questionCounter = 0
  playGame()
}

// Used for the timer
function decrementCounter() {
  if (time > 0) {
    time--
    $('#countdown').text(time)
  } else {
    incorrectAnswerHandler();
  }
  if (time < 5) {
    $('#countdown').css('color', '#A50520')
  } else {
    $('#countdown').css('color', '#A4C552')
  }
}

// The API results include 'HTML entities' that need to be decoded. 
// Turns out that's not super easy to do. Thus this function.
function decodeResponse(response) {
  var responseToDecode = response;
  var encodedResponse = encodeURI(responseToDecode);
  var decodedResponse = decodeURI(encodedResponse);
  return decodedResponse
}

// Main Click Handler
$(".answer").on('click', function () {
  if (this.textContent === questions[questionCounter].correct_answer) {
    var correctId = (this.id);
    correctAnswerHandler(correctId)
  } else {
    incorrectAnswerHandler()
  }
})

