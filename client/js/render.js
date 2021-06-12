var lineCount = 10;
var lineHeight = 20;
var cursorLine = 0;
var cursorIndex = 0;
var cursorOffset = 0;
var lineMarkerWrapper, codeWrapper;
var input;
var codeArray = [];
var tokenArray = [];
var offsetArray = [];
var textWidthFinder;

function renderEditor(){
    lineMarkerWrapper = document.getElementById("editor_line_marker_wrapper");
    codeWrapper = document.getElementById('editor_code_wrapper');
    textWidthFinder = document.getElementById('text_width_finder');

    for(let i = 0; i < lineCount; i++){
        lineMarkerWrapper.appendChild(renderLineMarker(i));
        codeWrapper.appendChild(renderCodeLine(i));
        codeArray.push("");
        tokenArray.push([]);
        offsetArray.push(0);
    }
    renderTextarea();
}

function renderTextarea(){
    input = document.createElement('textarea');
    input.id="edit_textarea";
    input.wrap = "off";
    input.autofocus = true;
    input.autocapitalize = "off";
    input.spellcheck = false;
    input.style.top = lineHeight * cursorLine + "px";
    input.style.height = `${lineHeight}px`;
    input.style.lineHeight = `${lineHeight}px`;
    input.style.left = `${cursorOffset}px`;

    codeWrapper.appendChild(input);
}

function renderLineMarker(index){
    let bgColor = cursorLine === index ? "#272727" : "#2F3129";
    let color = cursorLine === index ? "white" : "#808080";

    var marker = document.createElement("div");
    marker.classList.add('editor_line_marker');
    marker.id= `editor_line_marker_${index}`;
    marker.style.backgroundColor = bgColor;
    marker.style.height = `${lineHeight}px`;
    marker.style.color = color;

    let markerSpan = document.createElement("span");
    markerSpan.innerText = index+1;
    markerSpan.style.marginRight = "5px";

    marker.appendChild(markerSpan);
    return marker;
}

function renderCodeLine(index){
    let bgColor = cursorLine === index ? "#202020" : "#272822";

    var codeLine = document.createElement("div");
    codeLine.classList.add("editor_code_line");
    codeLine.id = `editor_code_line_${index}`;
    codeLine.style.backgroundColor = bgColor;
    codeLine.style.height = `${lineHeight}px`;
    codeLine.style.top = lineHeight * index + "px";
    codeLine.onclick = () => {
        focusLine(index);
    }

    return codeLine;
}

function renderTokens(index){
    var codeLine = document.getElementById(`editor_code_line_${index}`);
    
    tokenArray[index].forEach((token, index) => {
        // token.name and token.val
    })
}