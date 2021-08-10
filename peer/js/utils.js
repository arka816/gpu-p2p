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