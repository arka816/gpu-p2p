'use strict';

function findWidthofChar(c){
    c = c.replaceAll(" ", "\u00a0");
    textWidthFinder.innerText = c;
    let width = textWidthFinder.getBoundingClientRect().width;
    return width;
}

if(!String.prototype.splice){
    String.prototype.splice = function(start, delCount, ...strList){
        var str = strList.join('');
        return this.slice(0, start) + str + this.slice(start + Math.abs(delCount));
    }
}

function $(s){
    if(s[0] != '#' && s[0] != "."){
        return document.getElementsByTagName(s);
    }
    var identifier = s.slice(1);
    var identifier_type = s[0];
    
    switch(identifier_type){
        case '#': return document.getElementById(identifier);
        case '.': return document.getElementsByClassName(identifier);
    }
}