'use strict';

function focusLine(e){
    var index = parseInt(e.target.dataset.index);
   
    if(index === cursorLine){
        cursorIndex = codeArray[cursorLine].length
        cursorOffset = findWidthofChar(codeArray[cursorLine])

        input.style.top = lineHeight * index + "px";
        input.style.left = cursorOffset + "px";
        input.focus();
        return;
    }
    changeLineFocus(cursorLine, index);

    cursorLine = index;
    cursorIndex = codeArray[cursorLine].length
    cursorOffset = findWidthofChar(codeArray[cursorLine])

    input.style.top = lineHeight * index + "px";
    input.style.left = cursorOffset + "px";
    input.focus();
}

function changeLineFocus(oldline, newline){
    let oldMarker = $(`#editor_line_marker_${oldline}`)
    let oldCodeLine = $(`#editor_code_line_${oldline}`)
    let newMarker = $(`#editor_line_marker_${newline}`);
    let newCodeLine = $(`#editor_code_line_${newline}`);

    oldMarker.style.backgroundColor = '#2F3129';
    oldMarker.style.color = "#808080";
    oldCodeLine.style.backgroundColor = '#272822';

    newMarker.style.backgroundColor = '#272727';
    newMarker.style.color = "white";
    newCodeLine.style.backgroundColor = '#202020';
}

function spanCursorHandler(e){
    let {line, index} = e.target.dataset;
    line = parseInt(line);
    index = parseInt(index);
    var code = tokenArray[line][index][0];
    e.preventDefault();
    e.stopPropagation();

    var x = e.clientX - e.target.getBoundingClientRect().left;

    var i = 0, w = 0;
    var l = tokenArray[line].slice(0, index).reduce(function(a, b){
        if(Array.isArray(a)) return a[0].length + b[0].length;
        return a + b[0].length
    }, 0);
    for(i = 0; i < code.length; i++){
        w += findWidthofChar(code[i]);
        if(w > x){
            if((w-x) < (x - w + findWidthofChar(code[i]))) i = i + 1;
            break;
        }
    }
    let offset = findWidthofChar(codeArray[line].slice(0, l + i));
    cursorIndex = l + i;
    cursorOffset = offset;
    input.style.left = offset + "px";
    input.style.top = lineHeight * line + "px";
    input.focus();
    changeLineFocus(cursorLine, line);
    cursorLine = line;
}

function inputHandler(e){
    let c = e.target.value;
    e.target.value = "";

    if(c === "\n") return;

    codeArray[cursorLine] = codeArray[cursorLine].splice(cursorIndex, 0, c);
    cursorIndex += 1;

    let offset = findWidthofChar(codeArray[cursorLine].slice(0, cursorIndex));
    let tokens = lexer.tokenize(codeArray[cursorLine]);

    cursorOffset = offset;

    tokenArray[cursorLine] = tokens;

    renderTokens(cursorLine);
    input.style.left = `${cursorOffset}px`;
}

function inputKeyHandler(e){
    var k = e.keyCode || e.charCode;
    if(k === 13){
        /* Enter key */
        let oldMarker = document.getElementById(`editor_line_marker_${cursorLine}`);
        let oldCodeLine = document.getElementById(`editor_code_line_${cursorLine}`);
        oldCodeLine.style.backgroundColor = '#272822';
        oldMarker.style.backgroundColor = '#2F3129';
        oldMarker.style.color = "#808080";

        let brokenCode = codeArray[cursorLine].slice(cursorIndex);

        codeArray[cursorLine] = codeArray[cursorLine].slice(0, cursorIndex);
        tokenArray[cursorLine] = lexer.tokenize(codeArray[cursorLine]);

        cursorLine += 1;
        cursorOffset = 0;
        cursorIndex = 0;

        codeArray.splice(cursorLine, 0, brokenCode);
        tokenArray.splice(cursorLine, 0, lexer.tokenize(brokenCode));

        input.style.left = `${cursorOffset}px`;
        input.style.top = lineHeight * cursorLine + "px";

        insertCodeLine(cursorLine);
    }
    else if(k === 8){
        /* Backspace Key */
        if(cursorIndex === 0){
            if(cursorLine === 0){
                return;
            }
            else{
                cursorLine -= 1;
                cursorIndex = codeArray[cursorLine].length;
                cursorOffset = findWidthofChar(codeArray[cursorLine]);

                let brokenCode = codeArray[cursorLine + 1];
                codeArray[cursorLine] += brokenCode;
                tokenArray[cursorLine] = lexer.tokenize(codeArray[cursorLine]);

                codeArray.splice(cursorLine + 1, 1);
                tokenArray.splice(cursorLine + 1, 1);

                input.style.left = `${cursorOffset}px`;
                input.style.top = lineHeight * cursorLine + "px";

                let newMarker = document.getElementById(`editor_line_marker_${cursorLine}`);
                let newCodeLine = document.getElementById(`editor_code_line_${cursorLine}`);

                newMarker.style.backgroundColor = '#272727';
                newMarker.style.color = "white";
                newCodeLine.style.backgroundColor = '#202020';

                spliceCodeLine(cursorLine + 1);
            }
        }
        else{
            cursorOffset = findWidthofChar(codeArray[cursorLine].slice(0, cursorIndex - 1));
            codeArray[cursorLine] = codeArray[cursorLine].splice(cursorIndex - 1, 1);
            cursorIndex -= 1;
            tokenArray[cursorLine] = lexer.tokenize(codeArray[cursorLine]);
            input.style.left = `${cursorOffset}px`;
            renderTokens(cursorLine);
        }
    }
    else if(k === 46){
        /* Del Key */
        if(cursorIndex === codeArray[cursorLine].length){
            if(cursorLine === lineCount - 1){
                return;
            }
            else{
                let brokenCode = codeArray[cursorLine + 1];
                codeArray[cursorLine] += brokenCode;
                tokenArray[cursorLine] = lexer.tokenize(codeArray[cursorLine]);

                codeArray.splice(cursorLine + 1, 1);
                tokenArray.splice(cursorLine + 1, 1);

                spliceCodeLine(cursorLine + 1);
            }
        }
        else{
            codeArray[cursorLine] = codeArray[cursorLine].splice(cursorIndex, 1);
            tokenArray[cursorLine] = lexer.tokenize(codeArray[cursorLine]);
            renderTokens(cursorLine);
        }
    }
    else if(k === 39){
        /* Right Arrow Key */
        if(cursorIndex === codeArray[cursorLine].length){
            if(cursorLine === lineCount - 1) return;
            else{
                cursorLine += 1;
                cursorIndex = 0;
                cursorOffset = 0;
                input.style.top = lineHeight * cursorLine + "px";
                input.style.left = cursorOffset + "px";
                changeLineFocus(cursorLine - 1, cursorLine);
            }
        }
        else{
            cursorIndex += 1;
            cursorOffset = findWidthofChar(codeArray[cursorLine].slice(0, cursorIndex));
            input.style.left = cursorOffset + "px";
        }
    }
    else if(k === 37){
        /* Left Arrow Key */
        if(cursorIndex === 0){
            if(cursorLine === 0) return;
            else{
                cursorLine -= 1;
                cursorIndex = codeArray[cursorLine].length;
                cursorOffset = findWidthofChar(codeArray[cursorLine]);
                input.style.top = lineHeight * cursorLine + "px";
                input.style.left = cursorOffset + "px";
                changeLineFocus(cursorLine + 1, cursorLine);
            }
        }
        else{
            cursorIndex -= 1;
            cursorOffset = findWidthofChar(codeArray[cursorLine].slice(0, cursorIndex));
            input.style.left = cursorOffset + "px";
        }
    }
    input.focus();
}