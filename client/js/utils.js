function findWidthofChar(c){
    c = c.replaceAll(" ", "\u00a0");
    textWidthFinder.innerText = c;
    let width = textWidthFinder.getBoundingClientRect().width;
    return width;
}