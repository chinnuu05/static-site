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
function Level3Click(e) {
  ChangeWaterLevelWithAnimation(e.target.id);

}

function Level2Click(e) {
  ChangeWaterLevelWithAnimation(e.target.id);

}

function Level1Click(e) {

  ChangeWaterLevelWithAnimation(e.target.id);
}

// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function LoadWaterLevel() {
  // check if a value has been stored for today
  // if there is load it
  // if not set water to 0, and

  waterIntakeItem = localStorage.getItem("WaterIntake");
  var waterIntake;
  if (waterIntakeItem != null) {
    waterIntake = JSON.parse(waterIntakeItem);
    waterValue = waterIntake["WaterLevel"];

    if (waterValue != "level0") {
      ChangeWaterLevelWithoutAnimation(waterValue);
    }
}

function GetLiterValue(id) {
  return liter_labels[id.split('level')[1] - 1];
}

function ChangeWaterLevelWithoutAnimation(id) {
  var targetLevel = water_values[id];
  var target = water_labels[id];
  var waterInnerTarget = water_inner_values[id];

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
    return;
   }
  // btn.removeEventListener('click', IncreaseLevel);
  isInProgress = true;

  var actualValue = parseInt(actual.innerHTML);
  var percent;
  var counter = parseInt(document.getElementById("count").innerText);
  var currentIndex;

  var target = water_labels[id];
  var targetLevel = water_values[id];
  var waterInnerTarget = water_inner_values[id];
  // console.log(water_inner_values[id]);
  var waterInnerCounter = parseInt(water.querySelector('.water__inner').style.height);

  // console.log(document.getElementById("bubble-height").style);
  // console.log("height: " + document.getElementById("bubble-height").style.height);
  // console.log("Set Water inner target to: " + waterInnerTarget);
  // console.log("Set Water inner counter to: " + waterInnerCounter);

  if (actualValue == targetLevel) {
    isInProgress = false;
    return;
  }

  var changeBy = 1;

  if (actualValue > targetLevel) {
    changeBy = -1;
  }

  var waterInner = document.getElementById("bubble-height");
  var children = waterInner.querySelectorAll("div");

  // var waterInnerCounter = water_inner_values[currentIndex];
  interval = setInterval(function() {


    if (actualValue == targetLevel && counter == target) {
      clearInterval(interval);
      // when animation is finished then disable in progress to avoid spams
      isInProgress = false;
      water.querySelector('.water__inner').style.height = waterInnerTarget + "%";


      var today = {
        "Date": GetCurrentDate(),
        "WaterLevel": id,
        "IsAdded": true,
        "Liters": GetLiterValue(id)
      };

      localStorage.setItem("WaterIntake", JSON.stringify(today));
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
