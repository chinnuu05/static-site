// stored as gadget_pos and gadget_size in local storage
// position: top, left
// size: width, height

function SetDefaultPosition(gadget) {
    // datavase gadget left: -66px; top: 406px;
    // water gadget left: 214px; top: -5px;
    // task gagdet left: 498px; top: 337px;


    taskGadgetDefaultPos = [337, 498];
    waterGadgetDefaultPos = [-5, 214];
    databaseGadgetDefaultPos = [406, -66];
    switch (gadget) {
        case "WaterGadget":
            $('#' + gadget).css("top", waterGadgetDefaultPos[0] + "px");
            $('#' + gadget).css("left", waterGadgetDefaultPos[1] + "px");
            break;
        case "TaskGadget":
            $('#' + gadget).css("top", taskGadgetDefaultPos[0] + "px");
            $('#' + gadget).css("left", taskGadgetDefaultPos[1] + "px");
            break;
        case "DatabaseGadget":
            $('#' + gadget).css("top", databaseGadgetDefaultPos[0] + "px");
            $('#' + gadget).css("left", databaseGadgetDefaultPos[1] + "px");
            break;
    }
}

function SetDefaultSize(gadget) {
    // task gadget width: 259.521px; height: 265.094px;
    // water gadget width: 208.99px; height: 257px;
    // add to database gadget width: 282.99px; height: 198.6 

    taskGadgetDefaultSize = [259.521, 265.094];
    waterGadgetDefaultSize = [208.99, 257];
    databaseGadgetDefaultSize = [282.99, 198.6];

    switch (gadget) {
        case "WaterGadget":
            $('#' + gadget).css("width", waterGadgetDefaultSize[0] + "px");
            $('#' + gadget).css("height", waterGadgetDefaultSize[1] + "px");   
            break;
        case "TaskGadget":
            $('#' + gadget).css("width", taskGadgetDefaultSize[0] + "px");
            $('#' + gadget).css("height", taskGadgetDefaultSize[1] + "px");   
            break;
        case "DatabaseGadget":
            $('#' + gadget).css("width", databaseGadgetDefaultSize[0] + "px");
            $('#' + gadget).css("height", databaseGadgetDefaultSize[1] + "px");   
            break;
    }
}


function LoadGadgets() {

        // console.log("loading gadgets");
    var gadgets = ["WaterGadget", "TaskGadget", "DatabaseGadget"];

    gadgets.forEach(function(gadget) 
    {
        var unparsedPos = localStorage.getItem(gadget + "_pos");
        if (unparsedPos != null) {
            var pos = JSON.parse(unparsedPos);

            $('#' + gadget).css("top", pos[0] + "px");
            $('#' + gadget).css("left", pos[1] + "px");
        } else {

            SetDefaultPosition(gadget);
        }

        var unparsedSize = localStorage.getItem(gadget + "_size");

        if (unparsedSize != null) {
            var size = JSON.parse(unparsedSize);

            $('#' + gadget).css("width", size[0] + "px");
            $('#' + gadget).css("height", size[1] + "px");   

        } else {
            SetDefaultSize(gadget);
        }
    })

    // set text area height 
    var textAreaHeight = localStorage.getItem("databaseTextHeight");
    if (textAreaHeight != null) {
        console.log("Setting text area height to: " + textAreaHeight);
        var textArea = document.getElementById('databaseText');
        textArea.style.height = textAreaHeight;
    } else console.log("text area height no saved");
}
