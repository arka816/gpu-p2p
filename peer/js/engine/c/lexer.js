'use strict';

class CLexer{
    constructor(){
        this.tokens = [];
    }

    static datatypes = ["int", "float", "double", "char", "auto", "void"];
    static qualifiers = ["long", "short", "signed", "unsigned"];
    static keywords = ["for", "if", "else", "switch", "return", "goto", "register", "do", "while", "break", "continue", "struct", "enum", "union", "static", "case", "default", "sizeof", "typedef", "volatile", "extern"];
    static operators = ["+", "-", "*", "/", "%", "=", "==", "++", "--", "+=", "-=", "*=", "/=", ">", "<", ">=", "<=", "!=", ">>", "<<", ">>=", "<<=", "~", "!", "&", "|", "^", "&=", "|=", "^=", "~=", "?", ":", "&&", "||"];
    static punctuators = [",", ".", ";", "->", "#", "(", ")", "{", "}", "[", "]", "...", "\"", "'"];
    static preprocessor_directives = ['define', 'include', 'undef', 'ifdef', 'ifndef', 'if', 'else', 'elif', 'endif', 'error', 'pragma'];
    //const escapeseq = ["\n", "\r", "\t", "\b", "\\a", "\\'", "\"", "\\?", "\\", "\f", "\\v", "\\0", "\\nnn", "\\xhh"];
    //const comments = ["//", "*/", "/*"];
    /*static libraryFunctions = new Set([
        "abort","abs","acos","asctime","asctime_r","asin","assert","atan","atan2","atexit","atof","atoi","atol","bsearch","btowc",
        "calloc","catclose6","catgets6","catopen6","ceil","clearerr","clock","cos","cosh","ctime","ctime64","ctime_r","ctime64_r",
        "difftime","difftime64","div","erf","erfc","exit","exp","fabs","fclose","fdopen5","feof","ferror","fflush1","fgetc1","fgetpos1",
        "fgets1","fgetwc6","fgetws6","fileno5","floor","fmod","fopen","fprintf","fputc1","fputs1","fputwc6","fputws6","fread","free",
        "freopen","frexp","fscanf","fseek1","fsetpos1","ftell1","fwide6","fwprintf6","fwrite","fwscanf6","gamma","getc1","getchar1",
        "getenv","gets","getwc6","getwchar6","gmtime","gmtime64","gmtime_r","gmtime64_r","hypot","isalnum","isalpha","isascii4",
        "isblank","iscntrl","isdigit","isgraph","islower","isprint","ispunct","isspace","isupper","iswalnum4","iswalpha4","iswblank4",
        "iswcntrl4","iswctype4","iswdigit4","iswgraph4","iswlower4","iswprint4","iswpunct4","iswspace4","iswupper4","iswxdigit4",
        "isxdigit4","j0","j1","jn","labs","ldexp","ldiv","localeconv","localtime","localtime64","localtime_r","localtime64_r","log",
        "log10","longjmp", "main", "malloc","mblen","mbrlen4","mbrtowc4","mbsinit4","mbsrtowcs4","mbstowcs","mbtowc","memchr","memcmp",
        "memcpy","memmove","memset","mktime","mktime64","modf","nextafter","nextafterl","nexttoward","nexttowardl","nl_langinfo4","perror",
        "pow","printf","putc1","putchar1","putenv","puts","putwc6","putwchar6","qsort","quantexpd32","quantexpd64","quantexpd128",
        "quantized32","quantized64","quantized128","samequantumd32","samequantumd64","samequantumd128","raise","rand","rand_r","realloc",
        "regcomp","regerror","regexec","regfree","remove","rename","rewind1","scanf","setbuf","setjmp","setlocale","setvbuf","signal","sin",
        "sinh","snprintf","sprintf","sqrt","srand","sscanf","strcasecmp","strcat","strchr","strcmp","strcoll","strcpy","strcspn","strerror",
        "strfmon4","strftime","strlen","strncasecmp","strncat","strncmp","strncpy","strpbrk","strptime4","strrchr","strspn","strstr",
        "strtod","strtod32","strtod64","strtod128","strtof","strtok","strtok_r","strtol","strtold","strtoul","strxfrm","swprintf",
        "swscanf","system","tan","tanh","time","time64","tmpfile","tmpnam","toascii","tolower","toupper","towctrans","towlower4",
        "towupper4","ungetc1","ungetwc6","va_arg","va_copy","va_end","va_start","vfprintf","vfscanf","vfwprintf6","vfwscanf","vprintf",
        "vscanf","vsprintf","vsnprintf","vsscanf","vswprintf","vswscanf","vwprintf6","vwscanf","wcrtomb4","wcscat","wcschr","wcscmp",
        "wcscoll4","wcscpy","wcscspn","wcsftime","wcslen","wcslocaleconv","wcsncat","wcsncmp","wcsncpy","wcspbrk","wcsptime","wcsrchr",
        "wcsrtombs4","wcsspn","wcsstr","wcstod","wcstod32","wcstod64","wcstod128","wcstof","wcstok","wcstol","wcstold","wcstombs",
        "wcstoul","wcsxfrm4","wctob","wctomb","wctrans","wctype4","wcwidth","wmemchr","wmemcmp","wmemcpy","wmemmove","wmemset",
        "wprintf6","wscanf6","y0","y1","yn"
    ])*/

    static dualPunctuators = ["(", "{", "["];
    static dualPunctuatorsCounterpart = [")", "}", "]"];


    isNumeric(n){
        if (typeof n != "string") return false;
        return !isNaN(n) && !isNaN(parseFloat(n));
    }

    isChar(code){
        //needs revision
        let originalChar = code.slice(1, -1);
        if(originalChar.length > 1){
            if(originalChar.length === 2 && originalChar[0] === "\\") return true;
            return false;
        }
        return true;
    }

    checkIdentifier(token){
        var alphanumericRegExp = /^[0-9a-zA-Z_]+$/;
        return token.match(alphanumericRegExp);
    }

    cleanseTokens(){
        for(let i = 0; i < this.tokens.length; i++){
            if(this.tokens[i] === "") this.tokens.splice(i, 1);
        }
    }

    classify(){
        var indentedTokens = []
        var i = 0;
        while(i < this.tokens.length && this.tokens[i] === " "){
            i++;
        }
        
        let q = Math.floor(i/4);
        let r = i % 4;

        if(q > 0){
            for(let j = 0; j < q - 1; j++) indentedTokens.push(["    ", "indentation_guide_1"])
            if(r === 0) indentedTokens.push(["    ", "indentation_guide_2"])
            else indentedTokens.push(["    ", "indentation_guide_1"])
        }
        
        for(let i = 4*q; i < this.tokens.length; i++){
            indentedTokens.push([this.tokens[i], this.classifyToken(this.tokens[i])]);
        }
        this.tokens = indentedTokens;
    }

    classifyToken(code){
        code = code.trim();
        if(code === "") return "space";
        else{
            if(CLexer.datatypes.indexOf(code) !== -1) return "type";
            else if(CLexer.qualifiers.indexOf(code) !== -1) return "qualifier";
            else if(CLexer.keywords.indexOf(code) !== -1) return "keyword";
            else if(code[0] === "\"") return "string_literal";
            else if (code[0] === "'") return (this.isChar(code) ? "char_literal" : "error");
            else if(this.isNumeric(code)) return "numeric_literal";
            else{
                //symbols or identifiers
                if(CLexer.operators.indexOf(code) !== -1) return "operator";
                if(CLexer.punctuators.indexOf(code) !== -1){
                    if(code === '#') return 'operator';
                    else return "punctuator";
                }
                
                if(code.substring(0, 2) === "//") return "single_line_comment";
                else if(code.substring(0, 2) === "/*"){
                    if(code.substring(code.length - 2) === "*/") return "multi_line_comment";
                    else return "multi_line_comment_start";
                }
                else if(code.substring(code.length - 2, 2) === "*/") return "multi_line_comment_end";

                if(this.checkIdentifier(code)){
                    //if(CLexer.libraryFunctions.has(code)) return "lib_func";
                    if(CLexer.preprocessor_directives.includes(code)) return "preproc_dir";
                    return "identifier";
                }
                else{
                    return "error";
                }
            }
        }
    }



    tokenize(string){
        this.tokens = [];
        var stringMode = false;
        var charMode = false;
        var symbolMode = false;
        var commentMode = false;
        var currentToken = "";
        var c;

        for(let i = 0; i < string.length; i++){
            c = string[i];
            if(commentMode){
                //part of a multiline comment
                currentToken += c;
                if(c === "/" && i > 0 && string[i-1] === "*"){
                    //multi line comment ended
                    commentMode = false;
                    this.tokens[this.tokens.length - 1] += currentToken;
                    currentToken = "";
                }
            }
            else{
                if(c >= 'a' && c <= 'z'){
                    //identifier or datatype or qualifier or keyword
                    if(symbolMode){
                        this.tokens.push(currentToken);
                        currentToken = "";
                    }
                    currentToken += c;
                    symbolMode = false;
                }
                else if(c === "_"){
                    //string or character or identifier
                    if(symbolMode){
                        this.tokens.push(currentToken);
                        currentToken = "";
                    }
                    currentToken += c;
                    symbolMode = false;
                }
                else if(c >= 'A' && c <= 'Z'){
                    //identifier
                    if(symbolMode){
                        this.tokens.push(currentToken);
                        currentToken = "";
                    }
                    currentToken += c;
                    symbolMode = false;
                }
                else if(c >= '0' && c <= '9'){
                    //identifier or numeric
                    if(symbolMode){
                        this.tokens.push(currentToken);
                        currentToken = "";
                    }
                    currentToken += c;
                    symbolMode = false;
                }
                else if(c === " "){
                    if(!stringMode && !charMode){
                        this.tokens.push(currentToken);
                        currentToken = "";
                        this.tokens.push(" ");
                    }
                    else{
                        currentToken += c;
                    }
                    symbolMode = false;
                }
                else if(c === '"'){
                    if(symbolMode){
                        this.tokens.push(currentToken);
                        currentToken = "";
                    }
                    if(i > 0 && string[i-1] !== "\\"){
                        if(!stringMode){
                            //string is starting
                            this.tokens.push(currentToken);
                            currentToken = "\"";
                        }
                        else{
                            //string is ending
                            currentToken += c;
                            this.tokens.push(currentToken);
                            currentToken = "";
                        }
                        stringMode = !stringMode;
                    }
                    else{
                        currentToken += c;
                    }
                    symbolMode = false;
                }
                else if(c === "'"){
                    if(symbolMode){
                        this.tokens.push(currentToken);
                        currentToken = "";
                    }
                    if(i > 0 && string[i-1] !== "\\"){
                        if(!charMode){
                            //character is starting
                            this.tokens.push(currentToken);
                            currentToken = "'";
                        }
                        else{
                            //character is ending
                            currentToken += c;
                            this.tokens.push(currentToken);
                            currentToken = "";
                        }
                        charMode = !charMode;
                    }
                    else{
                        currentToken += c;
                    }
                    symbolMode = false;
                }
                else if(CLexer.punctuators.includes(c)){
                    //valid punctuator
                    if(symbolMode){
                        this.tokens.push(currentToken);
                        currentToken = "";
                    }
                    if(!stringMode && !charMode){
                        this.tokens.push(currentToken);
                        currentToken = "";
                        this.tokens.push(c);
                    }
                    else{
                        currentToken += c;
                    }
                    symbolMode = false;
                }
                else if(c === "\\"){
                    currentToken += c;
                }
                else{
                    //symbols
                    if(CLexer.operators.includes(c)){
                        //valid operator symbol
                        if(stringMode || charMode){
                            //part of a string
                            currentToken += c;
                        }
                        else{
                            //not part of string or character
                            //which means it is an individual symbol
                            //or part of the previous symbol if any
                            if(c === "/" && i > 0 && string[i-1] === "/"){
                                //single line comment started
                                //
                                this.tokens[this.tokens.length - 1] += "/" + string.substring(i);
                                this.cleanseTokens();
                                this.classify();
                                return this.tokens;
                            }
                            if(c === "*" && i > 0 && string[i-1] === "/"){
                                //mutliline comment started
                                currentToken += c;
                                commentMode = true;
                            }
                            if(!commentMode){
                                if(symbolMode){
                                    //last character was symbol too
                                    currentToken += c;
                                }
                                else{
                                    //last character was not symbol
                                    this.tokens.push(currentToken);
                                    currentToken = c;
                                }
                                symbolMode = true;
                            }
                        }
                    }
                    else{
                        if(stringMode || charMode){
                            //part of string
                            //so no problem
                        }
                        else{
                            this.tokens.push(currentToken);
                            this.tokens.push(c);
                            currentToken = "";
                        }
                        symbolMode = false;
                    }
                }
            }
        }

        this.tokens.push(currentToken);
        this.cleanseTokens();
        this.classify();
        return this.tokens;
    }
}
