'use strict';

var lineCount = 10;
var lineHeight = 20;
var cursorLine = 0;
var cursorIndex = 0;
var cursorOffset = 0;
var lineMarkerWrapper, codeWrapper;
var input;
var codeArray = [];
var tokenArray = [];
var textWidthFinder;

var selectionMode = false;

const lexer = new CLexer();

const colorCode = {
    type: "#5CD9EF",
    qualifier: "#5CD9EF",
    keyword: "#F92665",
    operator: "#F92665",
    punctuator: "#FFFFFF",
    escapeseq: "#7C75FF",
    error: "#FFFFFF",
    identifier: "#FFFFFF",
    string_literal: "#E6DB74",
    char_literal: "#E6DB74",
    numeric_literal: "#7C75FF",
    single_line_comment: "#1e9104",
    multi_line_comment: "#1e9104",
    multi_line_comment_start: "#1e9104",
    multi_line_comment_end: "#1e9104",
    indentation_guide_1: "transparent",
    indentation_guide_2: "transparent",
    lib_func: "#66D9E2",
    preproc_dir: '#F92665'
};

document.onselectstart = (e) => {
    selectionMode = true;
}

document.onselectionchange = (e) => {
    if(window.getSelection().toString().length > 0){
        console.log(selectionMode);
    }
}

document.onmouseup = (e) => {
    if(selectionMode && window.getSelection().toString().length > 0){
        selectionMode = false;
        console.log(selectionMode);
    }
}

function renderEditor(){
    lineMarkerWrapper = document.getElementById("editor_line_marker_wrapper");
    codeWrapper = document.getElementById('editor_code_wrapper');
    textWidthFinder = document.getElementById('text_width_finder');

    for(let i = 0; i < lineCount; i++){
        lineMarkerWrapper.appendChild(renderLineMarker(i));
        codeWrapper.appendChild(renderCodeLine(i));
        codeArray.push("");
        tokenArray.push([]);
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
    input.oninput = inputHandler;
    input.onkeydown = inputKeyHandler;

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
    codeLine.dataset.index = index;

    codeLine.addEventListener("click", focusLine, false);

    return codeLine;
}

function insertCodeLine(index){
    var codeLine = renderCodeLine(index);
    var marker = renderLineMarker(index);

    for(var line = lineCount - 1; line >= index; line--){
        let codeLine = document.getElementById(`editor_code_line_${line}`);
        codeLine.id = `editor_code_line_${line+1}`;
        codeLine.style.top = lineHeight * (line + 1) + "px";
        codeLine.dataset.index = line + 1;

        let marker = document.getElementById(`editor_line_marker_${line}`);
        marker.id = `editor_line_marker_${line+1}`;
        marker.childNodes[0].innerText = line + 2;
    }

    codeWrapper.insertBefore(codeLine, codeWrapper.childNodes[index]);
    lineMarkerWrapper.insertBefore(marker, lineMarkerWrapper.children[index]);

    renderTokens(index - 1);
    renderTokens(index);
    lineCount += 1;
}

function spliceCodeLine(index){
    codeWrapper.removeChild(codeWrapper.childNodes[index]);
    lineMarkerWrapper.removeChild(lineMarkerWrapper.childNodes[index]);

    for(var line = index + 1; line < lineCount; line++){
        let codeLine = document.getElementById(`editor_code_line_${line}`);
        codeLine.id = `editor_code_line_${line-1}`;
        codeLine.style.top = lineHeight * (line - 1) + "px";
        codeLine.dataset.index = line - 1;

        let marker = document.getElementById(`editor_line_marker_${line}`);
        marker.id = `editor_line_marker_${line - 1}`;
        marker.childNodes[0].innerText = line;
    }

    renderTokens(index - 1);

    lineCount -= 1;
}

function renderTokens(line){
    var codeLine = document.getElementById(`editor_code_line_${line}`);
    codeLine.innerText = "";
    
    tokenArray[line].forEach((token, index) => {
        let [value, category] = token;
        value = value.replaceAll(" ", "\u00a0");
        let span = document.createElement('span');
        span.contentEditable = false;
        span.spellcheck = false;
        span.style.color = colorCode[category];
        span.style.fontStyle = category === "type" || category === "qualifier" ? "italic" : "normal";
        span.innerText = value;
        span.classList.add("editor_code_span");
        if(category === "indentation_guide_1") span.classList.add("editor_code_span_indentation");

        span.dataset.line = line;
        span.dataset.index = index;
        span.addEventListener('click', spanCursorHandler, false);

        codeLine.append(span);
    })
}