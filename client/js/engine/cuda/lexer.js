const cudaKeyWords = ["__device__", "__global__", "__host__", "__constant__"];
const datatypes = ["int", "float", "double", "char", "auto", "void"];
const qualifiers = ["long", "short", "signed", "unsigned"];
const keywords = ["for", "if", "else", "switch", "return", "goto", "register", "do", "while", "break", "continue", "struct", "enum", "union", "static", "case", "default", "sizeof", "typedef", "volatile", "extern"];
const operators = ["+", "-", "*", "/", "%", "=", "==", "++", "--", "+=", "-=", "*=", "/=", ">", "<", ">=", "<=", "!=", ">>", "<<", ">>=", "<<=", "~", "!", "&", "|", "^", "&=", "|=", "^=", "~=", "?", ":", "&&", "||"];
const punctuators = [",", ".", ";", "->", "#", "(", ")", "{", "}", "[", "]", "...", "\"", "'"];
const preprocessor_directives = ['define', 'include', 'undef', 'ifdef', 'ifndef', 'if', 'else', 'elif', 'endif', 'error', 'pragma'];
//const escapeseq = ["\n", "\r", "\t", "\b", "\\a", "\\'", "\"", "\\?", "\\", "\f", "\\v", "\\0", "\\nnn", "\\xhh"];
//const comments = ["//", "*/", "/*"];
const libraryFunctions = new Set([
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
])

function lexer(index){
    var code = codeArray[index];
    var i = 0;
    var l = code.length;
    var c;
    var stringMode = false;
    var charMode = false;
    var token = "";
    var tokens = [];

    while(i < l){
        c = code[i];
        switch(c){
            case '+':
        }
    }
}