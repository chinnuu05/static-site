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

function SetLiterLabels() {

  // if request fails go with default 1,2,3
  $.get("http://localhost:1234/getliterlabels", function(data) {
    var labels = JSON.parse(data).Result;
    labels.forEach((label, i)  => {
      document.getElementById("level" + (i + 1)).innerText = label + "L";

      liter_labels.push(label);
    });

    console.log("Set liter labels to: " + labels);

  })
}

function LoadWaterLevel() {
  // check if a value has been stored for today
  // if there is load it
  // if not set water to 0, and

  waterIntakeItem = localStorage.getItem(GetCurrentDate());
  SetLiterLabels();
  var waterIntake;
  if (waterIntakeItem != null) {
    console.log("Loading previously stored water value for today");
    waterIntake = JSON.parse(waterIntakeItem);
    waterValue = waterIntake["WaterLevel"];
    ChangeWaterLevelWithoutAnimation(waterValue);


    // if (waterIntake["Date"] == GetCurrentDate()) {
    //   console.log("Date's match, loading the water value");
    //   ChangeWaterLevelWithAnimation(waterValue);
    // } else {
    //   console.log("date's dont match");
    // }
  } else console.log("No prevously stored water value");
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

  cnt.innerHTML = target;

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
    console.log("Water already at the button's water level");
    isInProgress = false;
    return;
  }

  var changeBy = 1;

  if (actualValue > targetLevel) {
    console.log("need to decrease");
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


      var today = localStorage.getItem(GetCurrentDate());
      var formatted = JSON.parse(today);

      // check if today's local storage already exists
      if (today == null) {
        console.log("today's first water click")
        // does not exist, first time hitting level3
        var isAdded = false;

        // if level 3 then we add right now
        if (id == "level3") isAdded = true;
        today = {
          "Date": GetCurrentDate(),
          "WaterLevel": id,
          "IsAdded": isAdded,
          "Liters": GetLiterValue(id)
        };
  
        var DatesToLog = []
        DatesToLog.push(today);
  

        
        if (isAdded) {
          console.log("It was leevl3, updating Notion database");
          if (UpdateWaterDatabase(DatesToLog)) {
            console.log("update water database succeeded");
          }
          else {
            console.log("update water databsae fialed");
            today = {
              "Date": GetCurrentDate(),
              "WaterLevel": id,
              "IsAdded": false,
              "Liters": GetLiterValue(id)
  
            };
          }
        }

        // set the local storage for today
        localStorage.setItem(GetCurrentDate(), JSON.stringify(today));

      }

      // previously stored local storage
      else {

        if (formatted["WaterLevel"] != id) {
          console.log("not first water click, but id's are not the same");
          var addRightNow = false;

          var isAdded = formatted["IsAdded"];
          console.log("Was this date already added: " + isAdded);


    
          var DatesToLog = []
          
          if (id == "level3" && !isAdded) {
            isAdded = true;
            addRightNow = true;
            // update the notion database (if it's level3)
            
          } else console.log("Did not add, id: " + id + " , was added: " + isAdded);

          // if level 3 then we add right now
          today = {
            "Date": GetCurrentDate(),
            "WaterLevel": id,
            "IsAdded": isAdded,
            "Liters": GetLiterValue(id)

          };
          DatesToLog.push(today);

          if (addRightNow) {
            console.log("It was leevl3 and not previously added, updating Notion database");
            var status = UpdateWaterDatabase(DatesToLog);
            console.log("update stsatus: " + status);
            if (status) {
              console.log("update water database succeeded");
            }
            else {
              console.log("update water databsae fialed");
              today = {
                "Date": GetCurrentDate(),
                "WaterLevel": id,
                "IsAdded": false,
                "Liters": GetLiterValue(id)
    
              };
            }
          }

          // set the local storage for today
          localStorage.setItem(GetCurrentDate(), JSON.stringify(today));
        }

        else {
          // it's the same, do nothing


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

    cnt.innerHTML = counter + (-changeBy);

    // isInProgress = false;
    actual.innerHTML = actualValue;
  }, 24);
}




function UpdateWaterDatabase(DatesToLog) {

  // waterlog format
  //   "Date": GetCurrentDate(),
  //   "WaterLevel": id,
  //   "IsAdded": isAdded
  console.log("Sending: " + DatesToLog);
  var request = $.post("http://localhost:1234/logwatergoal", JSON.stringify(DatesToLog), function() {
    
    // on success
    console.log("Posted /logwatergoal");
    // remove these added items from local storage
    console.log("removing the posted dates");
    DatesToLog.forEach(function(date) {
      localStorage.removeItem(data["Date"]);
      console.log("Removed item: " + data["Date"]);
    })
    return true;
  }, "application/json");

  request.fail(function() {
    // error dispatch
    console.log("logwatergoal failed");
    return false;
  })
}


function FetchPastWaterLogs() {
  var today = new Date();
  var month = today.getMonth() + 1;
  var day = today.getDate();

  if (day < 10) day = '0' + day;
  if (month < 10) month = '0' + month;
  var DatesToLog = [];

  for (i = 1; i < day; i++) {
    // pull all the days in this month so far up to today
    var iteratedDay = i;

    if (iteratedDay < 10) iteratedDay = '0' + iteratedDay;


    var loadedDate = i + '/' + month + "/" + today.getFullYear()
    var item = localStorage.getItem(loadedDate);



    if (item != null) {
      var json = JSON.parse(item);

      if (!json["IsAdded"]) {
        if (json["WaterLevel"] == "level3") {
          // shouldnt happen
          // console.log("Date is level3 but wasn't added. WTF?")
        }

        // date hasn't been added to the water database yet, add it to the list
        // console.log("Adding date: " + json["Date"]);
        DatesToLog.push(json);
        // console.log(DatesToLog.length);

        // update it to added
        var update = json;
        update["IsAdded"] = true;
        // console.log("Setting " + loadedDate + " to isADded = true");
        localStorage.setItem(loadedDate, JSON.stringify(update));

      }

    else {
      // console.log(json["Date"] + " was already added. Not adding again.");
    }
    }
    else {
      // console.log("Date: " + loadedDate + " was null. No local storage item for it.");
    }

  }
  console.log("Dates that need to be added: ");
  console.log(DatesToLog);
  if (DatesToLog.length > 0) {
    UpdateWaterDatabase(DatesToLog);
  }





  // ex: current date 29/09/2023
  // pull all days leading up to 29
  // if level3 then assume that it's already added to the database
  // if not, then call it and change to isAdded = True



}


function GetCurrentDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  // dd = dd - 1;

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = dd + '/' + mm + '/' + yyyy;
  return formattedToday;
}
