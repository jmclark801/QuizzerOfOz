// Global Variables
var secondsPerQuestion = 20
var time = secondsPerQuestion
var questionCounter = 0
var questions = []
var answers = []
var correct = 0
var incorrect = 0
var intervalID = ""

// ***********************
// Get questions using API 
function loadQuestions() {
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
  intervalID = setInterval(decrementCounter, 1000)
  $('#button-begin').addClass('hide')
  $('#results').addClass('hide')
  $('#content').addClass('show')
  correct = 0
  incorrect = 0
  time = secondsPerQuestion
  displayQuestion();
}



function nextQuestion() {
  if (questionCounter < questions.length - 1) {
    $("#countdown").text(secondsPerQuestion)
    time = secondsPerQuestion;
    questionCounter++
    console.log("in next Question")
    displayQuestion();
  } else {
    endGame()
  }
}

function displayQuestion() {
  var length = questions[questionCounter].incorrect_answers.length + 1;
  var randomNumber = (Math.floor(Math.random() * length))
  var answersArray = questions[questionCounter].incorrect_answers
  var correctAnswer = questions[questionCounter].correct_answer
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
  clearInterval(intervalID)
  $('#content').css('display', 'none')
  $('#results').removeClass('hide').addClass('show')
  $('#results-correct').text("Correct Answers: " + correct)
  $('#results-incorrect').text("Incorrect Answers: " + incorrect)
  console.log("The game is over, play again?")
  console.log("You got: " + incorrect + " wrong! USUX")
  console.log("You got: " + correct + " correct")
}

function playGameAgain(){
  
  playGame()
}

// *****************
// Utility Functions
function decrementCounter() {
  if (time > 0) {
    time--
    $('#countdown').text(time)
  } else {
    incorrectAnswerHandler();
  }
}

// The API results include 'HTML entities that need to be decoded. 
// Turns out that's not super easy to do. Thus this function.
// Compare the results in console.log to the decoded results
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

