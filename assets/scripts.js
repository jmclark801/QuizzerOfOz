// Things to do still:

// Global Variables
var secondsPerQuestion = 12
var time = secondsPerQuestion
var questionCounter = 0
var questions = []
var answers = []
var correct = 0
var incorrect = 0
var intervalID = ""

// Get questions using API 
function loadQuestions(){
  var request = new XMLHttpRequest()
  request.open('GET', 'https://opentdb.com/api.php?amount=10&category=11&type=multiple', true)
  //amount has been set into this request to 3 questions so this can be tested. The amount 
  //should be switched to 10 or more when ready for project submission
  request.onload = function(){
    var data = JSON.parse(this.response);
    console.log(data);
    data.results.forEach(question => {
      questions.push(question);
    });
  }
  request.send();
}

// Timer Functions
function decrementCounter(){
  if (time > 0){
    time--
    $('#countdown').text(time)
  } else {
    incorrectAnswerHandler();
  } 
}

document.getElementById("button-begin").addEventListener('click', function(){
  playGame()
});

function playGame(){
  intervalID = setInterval(decrementCounter, 1000)
  beginGame();
  displayQuestion(); 
}

function beginGame(){
  $('#button-begin').addClass('hide');
  correct = 0
  incorrect = 0 
  time = secondsPerQuestion
}

function displayQuestion() {
  var length = questions[questionCounter].incorrect_answers.length + 1;
  var randomNumber = (Math.floor(Math.random() * length)) 
  var answersArray = questions[questionCounter].incorrect_answers
  var correctAnswer = questions[questionCounter].correct_answer
  answersArray.splice(randomNumber, 0, correctAnswer)

  $('#question').text(questions[questionCounter].question).removeClass("hide").addClass("show");
  for (var i=0; i< answersArray.length; i ++){
    $('#answer'+ (i+1)).html(answersArray[i]).removeClass("hide").addClass("show answer")
  }

  // ************************
  // For the html entity, try .html(thing to insert).text()
  console.log(answersArray);

  $(".answer").on('click', function(){
    if (this.textContent === questions[questionCounter].correct_answer){
      correctAnswerHandler()
    } else {
      incorrectAnswerHandler()
    }
  })
}

function correctAnswerHandler(){
  correct++
  nextQuestion()
}

function incorrectAnswerHandler(){
  incorrect++;
  nextQuestion();
}

function endGame(){
  clearInterval(intervalID)
  console.log("The game is over, play again?")
  console.log("You got: " + incorrect + " wrong! USUX")
  console.log("You got: " + correct + " correct")
}

function nextQuestion(){
  if (questionCounter < questions.length -1) {
    time = secondsPerQuestion;
    questionCounter++ 
    displayQuestion();
  } else {
    endGame()
  } 
}
loadQuestions();



