var global_clearOnNextInput = true;
var global_currentTotal = 0;

$(document).ready(function () {
    $(":button").click(function () {
        var input = $(this).text()

        handleInput(input);
        $(this).blur();
    });
});

function handleInput(input) {
    var currentVal = $("#inputValues").val();
    if ($.isNumeric(input)) {
        if (global_clearOnNextInput)
            $("#inputValues").val(input);
        else {
            $("#inputValues").val(currentVal + input);
        }
        global_clearOnNextInput = false;
    }
    else if (input == ".") {
        if (global_clearOnNextInput)
            $("#inputValues").val("0.");
        else {
            if (currentVal.indexOf(".") != -1)
                return; // do nothing with a second decimal point
            $("#inputValues").val(currentVal + input);
        }
        global_clearOnNextInput = false;
    }
    else if (input == "<-")
        deleteLast();
    else if (input == "+/-")
        negateInput();
    else if (input == "C")
        clearAll();
    else if (input == "CE")
        clearInput();
    else if (isOperation(input))
        handleOperation(input);
}

function deleteLast() {
    var inputValues = $("#inputValues").val();

    $("#inputValues").val(inputValues.substr(0, inputValues.length - 1));
}

function negateInput() {
    var inputValues = $("#inputValues").val();

    if (parseFloat(inputValues) !== 0) {
        inputValues = formatTotal(-1 * parseFloat(inputValues));
        $("#inputValues").val(inputValues);
    }
}

function clearAll() {
    //Clears the calculation string and input field.
    $("#inputValues").val("0");
    $("#displayHistory").val("");
    global_clearOnNextInput = true;
    global_currentTotal = 0;
}

function clearInput() {
    $("#inputValues").val("0");
    global_clearOnNextInput = true;
}

function handleOperation(inputOperation) {
    //This function either adds the number in the input field to the
    //calculation string, or, if the last thing in the calculation string
    //is an operation, and the input field is empty, it replaces that operation.
    var inputValues = $("#inputValues").val();
    var displayHistory = $("#displayHistory").val();
    var lastOperation = displayHistory[displayHistory.length - 1]

    if (inputValues == "" && !$.isNumeric(lastOperation))
        displayHistory = displayHistory.substr(0, displayHistory.length - 1) + inputVal;
    else {
        //If this is not the first operation in the display, recalculate the total for the most recent operation now.
        if (isOperation(lastOperation))
            calculateTotal(lastOperation);
        else
            global_currentTotal = parseFloat(inputValues);

        //Now update our display to reflect the current input
        if (inputOperation != "=")
            displayHistory += inputValues + inputOperation;
        else
            displayHistory = "";
    }

    //Update the display history with our changes.
    $("#displayHistory").val(displayHistory);
    global_clearOnNextInput = true;
}

function calculateTotal(operation) {
    //This function will take the current global total, and, using the passed operation,
    //use the input value to update the current global total, and the input value field.
    var inputValues = $("#inputValues").val();

    if (operation == "+")
        global_currentTotal = global_currentTotal + parseFloat(inputValues);
    else if (operation == "-")
        global_currentTotal = global_currentTotal - parseFloat(inputValues);
    else if (operation == "x")
        global_currentTotal = global_currentTotal * parseFloat(inputValues);
    else if (operation == "/")
        global_currentTotal = global_currentTotal / parseFloat(inputValues);

    $("#inputValues").val(formatTotal(global_currentTotal.toFixed(6)));
}

function formatTotal(fTotal) {
    var stringTotal = String(fTotal);
    while ((stringTotal[stringTotal.length - 1] == 0 || stringTotal[stringTotal.length - 1] == ".") && stringTotal.indexOf(".") != -1) {
        stringTotal = stringTotal.substr(0, stringTotal.length - 1);
    }
    return stringTotal;
}

function isOperation(operation) {
    if (operation == "+" || operation == "-" || operation == "x" || operation == "/" || operation == "=")
        return true;
}

$(document).keypress(function (event) {
    var charPressed = String.fromCharCode(event.which);

    if (event.which == 13)
        charPressed = "=";
    else if (charPressed == "*")
        charPressed = "x";

    handleInput(charPressed);
});

$(document).keydown(function (event) {
    if (event.keyCode == 46)
        clearInput();
    if (event.keyCode == 8)
        deleteLast();
});