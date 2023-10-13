var page = document.getElementById('page'),
  water = document.getElementById('water'),
  cnt = document.getElementById('count'),
  percent = parseInt(cnt.innerText),
  random, diff, interval, isInProgress;

var actual = document.getElementById("actual-value");
var literLabel = document.getElementById("liter-label");
// btn.addEventListener('click', IncreaseLevel);
// down.addEventListener('click', DecreaseLevel);

// assign click handlers to buttons
var level3 = document.getElementById("level3");
var level2 = document.getElementById("level2");
var level1 = document.getElementById("level1");

level3.addEventListener("click", Level3Click);
level2.addEventListener("click", Level2Click);
level1.addEventListener("click", Level1Click);


var water_labels = [0, 33, 67, 100];
var water_values = [25, 50, 75, 93];
var water_inner_values = [50, 65, 90, 110];

var highestLiterLabel;

var testing = 0;

var water_inner_values = {
  "starting": 50,
  "level1": 50,
  "level2": 60,
  "level3": 95,
};

var liter_labels = [];


var water_labels = {

  "starting": 0,
  "level1": 33,
  "level2": 67,
  "level3": 100,

};

var water_values = {

  "starting": 20,
  "level1": 35,
  "level2": 56,
  "level3": 80,
};


var currentWaterValue;

$(document).ready(function() {
  LoadWaterLevel();

})

function Level3Click(e) {
  console.log("level3 clicked");
  ChangeWaterLevelWithAnimation(e.target.id);

}

function Level2Click(e) {
  console.log("level2 clicked");
  ChangeWaterLevelWithAnimation(e.target.id);

}

function Level1Click(e) {

  console.log("level1 clicked");
  ChangeWaterLevelWithAnimation(e.target.id);
}

// different sized bubbles randomly picked from
var bubbleClasses = ["bubble-small", "bubble-large", "bubble-normal"];

// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function LoadWaterLevel() {
  // check if a value has been stored for today
  // if there is load it
  // if not set water to 0, and

  waterIntakeItem = localStorage.getItem(GetCurrentDate());
  var waterIntake;
  if (waterIntakeItem != null) {
    console.log("Loading previously stored water value for today");
    waterIntake = JSON.parse(waterIntakeItem);
    waterValue = waterIntake["WaterLevel"];
    console.log("Loading water value to: " + waterValue);

    if (waterValue != "level0") {
      ChangeWaterLevelWithoutAnimation(waterValue);
    }

  } else console.log("No prevously stored water value");
}

function GetLiterValue(id) {
  return liter_labels[id.split('level')[1] - 1];
}

function ChangeWaterLevelWithoutAnimation(id) {
  var targetLevel = water_values[id];
  var target = water_labels[id];
  var waterInnerTarget = water_inner_values[id];

  console.log("Changing without naimation to: " + targetLevel + ", changing label to: " + target);

  water.style.transform = 'translate(0, ' + (100 - targetLevel) + '%)';
  // water.querySelector('.water__inner').style.height = actualValue + '%';
  // console.log("setting water_inner to: " + waterInnerCounter + "%");

  // console.log(waterInnerCounter);
  // water.querySelector('.water__inner').style.height = waterInnerCounter + "%";

  cnt.innerHTML = target + "%";

  // isInProgress = false;
  actual.innerHTML = targetLevel;

}

function ChangeWaterLevelWithAnimation(id) {
  if (isInProgress) {
    console.log("was in progess; ending;");
    return;
   }
  // btn.removeEventListener('click', IncreaseLevel);
  isInProgress = true;

  var actualValue = parseInt(actual.innerHTML);


  var waterText = $('.active').find(".water-text");
  var counter = parseInt(waterText.find('#count').html());
  console.log("Counter set to: " + counter);

  // var counter = parseInt(document.getElementById("count").innerText.replace('%', ''));
  var target = water_labels[id];
  var targetLevel = water_values[id];
  var waterInnerTarget = water_inner_values[id];
  var waterInnerCounter = parseInt(water.querySelector('.water__inner').style.height);


  if (actualValue == targetLevel) {
    console.log("Water already at the button's water level");
    isInProgress = false;
    return;
  }

  var changeBy = 1;

  if (actualValue > targetLevel) {
    changeBy = -1;
  }

  console.log("Changing with animation till it hits: " + targetLevel + " | Counter set to: " + counter);
  interval = setInterval(function() {

    if (actualValue == targetLevel && counter == target) {
      clearInterval(interval);

      console.log("Final after animation done: " + cnt.innerHTML);

      // when animation is finished then disable in progress to avoid spams

      
      isInProgress = false;
      water.querySelector('.water__inner').style.height = waterInnerTarget + "%";


      var today = localStorage.getItem(GetCurrentDate());
      var formatted = JSON.parse(today);

      // check if today's local storage already exists
      if (today == null) {
        today = {
          "Date": GetCurrentDate(),
          "WaterLevel": id,
          "Liters": GetLiterValue(id)
        };
        localStorage.setItem(GetCurrentDate(), JSON.stringify(today));

      }

      // previously stored local storage
      else {

        if (formatted["WaterLevel"] != id) {
          console.log("not first water click, but id's are not the same");
          today = {
            "Date": GetCurrentDate(),
            "WaterLevel": id,
            "Liters": GetLiterValue(id)

          };
          localStorage.setItem(GetCurrentDate(), JSON.stringify(today));
        }
      }
    } 
    


    if (actualValue != targetLevel) actualValue += changeBy;
    if (counter <= 100) counter += changeBy;
    if (waterInnerCounter != waterInnerTarget) waterInnerCounter += changeBy;


    // console.log("setting water level to: " + (100 - actualValue))

    water.style.transform = 'translate(0, ' + (100 - actualValue) + '%)';
    // water.querySelector('.water__inner').style.height = actualValue + '%';
    // console.log("setting water_inner to: " + waterInnerCounter + "%");

    // console.log(waterInnerCounter);
    // water.querySelector('.water__inner').style.height = waterInnerCounter + "%";

    cnt.innerHTML = counter + (-changeBy) + "%";

    // isInProgress = false;
    actual.innerHTML = actualValue;
  }, 24);
}

function GetCurrentDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  dd = dd + testing;

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = dd + '/' + mm + '/' + yyyy;
  return formattedToday;
}
