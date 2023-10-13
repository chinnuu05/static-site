var tasks = [];
var inputs = [];
var inputStates = [];

$(document).ready(function() {
    // var l = {
    //     "Date": "28/09/2023",
    //     "WaterLevel": "level2",
    //     "IsAdded": false
    // }

    // var b = {
    //     "Date": "27/09/2023",
    //     "WaterLevel": "level1",
    //     "IsAdded": false
    // }
    // localStorage.setItem("28/09/2023", JSON.stringify(l));
    // localStorage.setItem("27/09/2023", JSON.stringify(b));
    // LoadWaterLevel();
    // FetchPastWaterLogs();
    LoadGadgets();
    // SetDatabaseNameAndLink();
    // LoadTaskWidget();






});


function ErrorNotificationDispatcher() {
    // manages error notifications
    // ensures not more than one error notified at atime
}


function SetDatabaseNameAndLink() {
    var fetchName = $.get("http://localhost:1234/fetchdbname", function(data) {
        var tuple = JSON.parse(data);
        console.log("Database json: " + tuple.Item1);
        console.log("Database json: " + tuple.Item2);

        $('#addDatabaseLink').attr("href", tuple.Item1);
        $('#databaseText').attr("placeholder", "Adding to " + tuple.Item2);
    });

    fetchName.fail(function() {
        $('#addDatabaseLink').attr("href", "");
        $('#databaseText').attr("placeholder", "Couldn't connect. Try restarting Lively Wallpaper.");
    })
}


function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}


$('#addToDatabaseBtn').click(function() {
    $(this).prop("disabled", true);
    // add spinner to button
    $(this).html(
      `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
    );

    var inputText = $('#databaseText').val();
    // console.log("sending: " + inputText);


    var addReq = $.post("http://localhost:1234/addtodb/", inputText, function() {
        console.log("sent add to db request");
        setTimeout(function(){

            $('#addToDatabaseBtn').html('Add');
            $('#addToDatabaseBtn').prop('disabled', false);
        }, 300);
        console.log("add db is done");
    }).fail(function() {
        $('#addToDatabaseBtn').html('Add');
        $('#addToDatabaseBtn').prop('disabled', false);
        $('#databaseText').val('');
        $('#databaseText').attr("placeholder", "Request failed...");
    });



})

// function UpdateTasks(blockID, ) {
//     console.log("updating tasks");
//     console.log(tasks);

//     $(tasks).each(function(index) {
//         // retrieve checked status
//         // retrieve span
//         $('#')


//     });
// }


function LoadTaskWidget() {
    // $('#four').prop("checked", true);

    var request = $.getJSON("http://localhost:1234/tasks", function(data) {
        var count = 0;
        console.log(data);
        $('.task-container').empty();
        $.each(data, function(key, val) {


            var checkboxName = count + 'check';

            var input = document.createElement('input');
            input.type = "checkbox";
            input.id = count.toString();
            input.checked = val.IsChecked;

            var label = document.createElement('label');
            label.htmlFor = input.id;
            label.id = count + "task";
            label.classList.add("task");

            var boxSpan = document.createElement('span');
            boxSpan.id = count + "check";
            boxSpan.setAttribute('notion-id', val.ID);

            boxSpan.classList.add("checkbox");

            var textSpan = document.createElement('span');
            textSpan.id = count + "strike";
            textSpan.textContent = " " + val.PlainText;
            textSpan.classList.add("task-text");

            tasks.push(count + "task");
            inputs.push(count);

            inputStates.push(val.IsChecked);

            $('.task-container').append(input, label);
            $("#" + count + "task").append(boxSpan, textSpan);

            $("#" + count + "task").click(function(e) {
                setTimeout(function() {

                    // $.each(inputs, function(index) {
                    //     // console.log("disabled all inputs");
                    //     $('#' + index).prop('disabled', true);
                    // })

                    var isChecked;
                    var c = document.getElementById(checkboxName);

                    var notionId = c.getAttribute("notion-id");

                    var pseudo = window.getComputedStyle(c, ':before');
                    var value = pseudo.getPropertyValue("content");

                    // console.log(value);
                    if (value == "none") {

                        isChecked = false;
                    } else {
                        isChecked = true;
                    }


                    var req = {
                        blockID: notionId,
                    };

                    // check if pseuedo element matches input state
                    var index = parseInt(e.target.id);



                    if (inputStates[index] != isChecked) {
                        // console.log("valid click");
                    } else {
                        // console.log("invalid");
                    }

                    // console.log(isChecked);
                    $.get("http://localhost:1234/updatetasks/" + notionId + "/" + isChecked, function(response) {


                        console.log(response);

                        if (response != "No-Error") {
                            // console.log("creating alert");
                            // var div = document.createElement("div");
                            // div.classList.add("alert");
                            // div.classList.add("alert-danger");
                            // div.classList.add("fixed-alert");
                            // div.classList.add("alert-dismissable");
                            // div.classList.add("fade");
                            // div.classList.add("show");

                            // var close = document.createElement("button");
                            // close.classList.add("close");
                            // close.setAttribute("data-bs-dismiss", "close");
                            // close.setAttribute("aria-label", "close");

                            // div.append(close);

                            // var text = document.createElement("span");
                            // text.innerText = "&times;";
                            // close.append(text);

                            // div.append(document.createTextNode("Slow down, the Notion API can't keep up!"))

                            // div.style.zIndex = 99;
                            // $('#bootstrap-overrides').append(div);

                        }
                        // $.each(inputs, function(index) {
                        //     // console.log("enabling all inputs");
                        //     $('#' + index).prop('disabled', false);
                        // })
                    });

                }, 500);
            });

            count++;


        });


    });

    request.fail(function() {
        console.log("Couldn't load tasks");

        $("#taskgadget-status").html("Couldn't connect. Try restarting Lively Wallpaper.");
    });
}

