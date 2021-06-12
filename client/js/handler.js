function focusLine(index){
    if(index === cursorLine) return;
    let oldMarker = document.getElementById(`editor_line_marker_${cursorLine}`);
    let oldCodeLine = document.getElementById(`editor_code_line_${cursorLine}`);
    let newMarker = document.getElementById(`editor_line_marker_${index}`);
    let newCodeLine = document.getElementById(`editor_code_line_${index}`);

    oldMarker.style.backgroundColor = '#2F3129';
    oldMarker.style.color = "#808080";
    oldCodeLine.style.backgroundColor = '#272822';

    newMarker.style.backgroundColor = '#272727';
    newMarker.style.color = "white";
    newCodeLine.style.backgroundColor = '#202020';

    input.style.top = lineHeight * index + "px";
    input.style.left = offsetArray[index] + "px";
    input.focus();

    cursorLine = index;
}

function inputHandler(e){
    let c = e.target.value;
    e.target.value = "";
    
}