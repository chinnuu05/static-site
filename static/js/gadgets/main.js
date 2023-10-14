var tasks = [];
var inputs = [];
var inputStates = [];
var AddNewTaskInProcess = false;
var universalDelay = 2000;
var taskCount = 0;

$(document).ready(function() {
    LoadGadgets();
    LoadWaterLevel();
});

$('#addNewTask').click(function() {
    var newTask = $('.add-task-input').val();

    console.log("adding task: " + newTask);
    if (newTask.length > 0) {
        $('#addNewTask').html(
            `<span class="spinner-border spinner-border-sm d-flex justify-content-center align-middle" role="status" aria-hidden="true"></span>`
        );
        $('.add-task-input').val("");

        console.log("Added new block successfully");
        // add the block
        var checkboxName = taskCount + 'check';

        var input = document.createElement('input');
        input.type = "checkbox";
        input.classList.add("input-checkbox");
        input.id = taskCount.toString();
        input.checked = false;

        var label = document.createElement('label');
        label.htmlFor = input.id;
        label.id = taskCount + "task";
        label.classList.add("task");

        var boxSpan = document.createElement('span');
        boxSpan.id = taskCount + "check";

        boxSpan.classList.add("checkbox");

        var textSpan = document.createElement('span');
        textSpan.id = taskCount + "strike";
        textSpan.textContent = newTask;
        textSpan.classList.add("task-text");

        $('#TaskGadget').css("height", "");
        $('.task-container').append(input, label);
        $("#" + taskCount + "task").append(boxSpan, textSpan);
        $('#addNewTask').html(
            `Add`
        );

        taskCount++;
    }
})

$('#addToDatabaseBtn').click(function() {

    setTimeout(function(){

        $('#addToDatabaseBtn').html('Add');
        $('#addToDatabaseBtn').prop('disabled', false);
        $('#databaseText').val("");
    }, 300);



})

$('#refresh-tasks').click(function() {
    console.log("refrshing tasks");

    // disable button till tasks load
    $(this).html(
        `<span class="spinner-border align-middle spinner-border-sm d-flex justify-content-center align-middle" role="status" aria-hidden="true"></span>`
      );
    $(this).prop("disabled", true);

    LoadTaskWidget(ReEnableButton = true);

})

