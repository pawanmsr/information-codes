grammar Morse;

/** The start rule: begin parsing here. */
message: word (WORD_SEPARATOR word)* EOF;

// Parser rules
word: character (CHARACTER_SEPARATOR character)* ;
character
    : short+
    | long (SYMBOL_SEPARATOR long)+
    | happy (SYMBOL_SEPARATOR happy)+ ;

// International Morse Code
// TODO: Verify with in-order traversal
short
    : DOT DOT DOT DOT DOT           // 5
    | DOT DOT DOT DOT               // H
    | DOT DOT DOT DOT DASH          // 4
    | DOT DOT DOT                   // S
    | DOT DOT DOT DASH              // V
    | DOT DOT DOT DASH DASH         // 3
    | DOT DOT                       // I
    | DOT DOT DASH DOT              // F
    | DOT DOT DASH                  // U
    | DOT DOT DASH DASH DOT DOT     // Question mark (?)
    | DOT DOT DASH DASH DOT DASH    // Underscore (_)
    | DOT DOT DASH DASH DASH        // 2
    | DOT                           // E
    | DOT DASH DOT DOT DOT          // Ampersand (&)
    | DOT DASH DOT DOT              // L
    | DOT DASH DOT DOT DASH DOT     // Quote (")
    | DOT DASH DOT                  // R
    | DOT DASH DOT DASH DOT DASH    // Period (.)
    | DOT DASH DOT DASH DOT         // Plus (+)
    | DOT DASH                      // A
    | DOT DASH DASH DOT DASH DOT    // At sign (@)
    | DOT DASH DASH DOT             // P
    | DOT DASH DASH                 // W
    | DOT DASH DASH DASH DASH DOT   // Apostrophe (')
    | DOT DASH DASH DASH DASH       // 1
    | DOT DASH DASH DASH            // J

    | DASH DOT DOT DOT DOT DASH     // Hyphen (-)
    | DASH DOT DOT DOT DOT          // 6
    | DASH DOT DOT DOT              // B
    | DASH DOT DOT DOT DASH         // Equal (=)
    | DASH DOT DOT                  // D
    | DASH DOT DOT DASH DOT         // Slash (/)
    | DASH DOT DOT DASH             // X
    | DASH DOT                      // N
    | DASH DOT DASH DOT             // C
    | DASH DOT DASH DOT DASH DOT    // Semicolon (;)
    | DASH DOT DASH DOT DASH DASH   // Exclamation (!)
    | DASH DOT DASH                 // K
    | DASH DOT DASH DASH DOT DASH   // Parenthesis )
    | DASH DOT DASH DASH DOT        // Parenthesis (
    | DASH DOT DASH DASH            // Y
    | DASH                          // T
    | DASH DASH DOT DOT DOT         // 7
    | DASH DASH DOT DASH            // Z
    | DASH DASH DOT DOT DASH DASH   // Comma (,)
    | DASH DASH DOT                 // G
    | DASH DASH DOT DASH            // Q
    | DASH DASH                     // M
    | DASH DASH DASH DOT DOT DOT    // Colon (:)
    | DASH DASH DASH DOT DOT        // 8
    | DASH DASH DASH                // O
    | DASH DASH DASH DASH DOT       // 9
    | DASH DASH DASH DASH DASH      // 0
    ;

long
    : DIT DIT DIT DIT DIT           // 5
    | DIT DIT DIT DIT               // H
    | DIT DIT DIT DIT DAH           // 4
    | DIT DIT DIT                   // S
    | DIT DIT DIT DAH               // V
    | DIT DIT DIT DAH DAH           // 3
    | DIT DIT                       // I
    | DIT DIT DAH DIT               // F
    | DIT DIT DAH                   // U
    | DIT DIT DAH DAH DIT DIT       // Question mark (?)
    | DIT DIT DAH DAH DIT DAH       // Underscore (_)
    | DIT DIT DAH DAH DAH           // 2
    | DIT                           // E
    | DIT DAH DIT DIT DIT           // Ampersand (&)
    | DIT DAH DIT DIT               // L
    | DIT DAH DIT DIT DAH DIT       // Quote (")
    | DIT DAH DIT                   // R
    | DIT DAH DIT DAH DIT DAH       // Period (.)
    | DIT DAH DIT DAH DIT           // Plus (+)
    | DIT DAH                       // A
    | DIT DAH DAH DIT DAH DIT       // At sign (@)
    | DIT DAH DAH DIT               // P
    | DIT DAH DAH                   // W
    | DIT DAH DAH DAH DAH DIT       // Apostrophe (')
    | DIT DAH DAH DAH DAH           // 1
    | DIT DAH DAH DAH               // J

    | DAH DIT DIT DIT DIT DAH       // Hyphen (-)
    | DAH DIT DIT DIT DIT           // 6
    | DAH DIT DIT DIT               // B
    | DAH DIT DIT DIT DAH           // Equal (=)
    | DAH DIT DIT                   // D
    | DAH DIT DIT DAH DIT           // Slash (/)
    | DAH DIT DIT DAH               // X
    | DAH DIT                       // N
    | DAH DIT DAH DIT               // C
    | DAH DIT DAH DIT DAH DIT       // Semicolon (;)
    | DAH DIT DAH DIT DAH DAH       // Exclamation (!)
    | DAH DIT DAH                   // K
    | DAH DIT DAH DAH DIT DAH       // Parenthesis )
    | DAH DIT DAH DAH DIT           // Parenthesis (
    | DAH DIT DAH DAH               // Y
    | DAH                           // T
    | DAH DAH DIT DIT DIT           // 7
    | DAH DAH DIT DAH               // Z
    | DAH DAH DIT DIT DAH DAH       // Comma (,)
    | DAH DAH DIT                   // G
    | DAH DAH DIT DAH               // Q
    | DAH DAH                       // M
    | DAH DAH DAH DIT DIT DIT       // Colon (:)
    | DAH DAH DAH DIT DIT           // 8
    | DAH DAH DAH                   // O
    | DAH DAH DAH DAH DIT           // 9
    | DAH DAH DAH DAH DAH           // 0
    ;

happy
    : BEEP BEEP BEEP BEEP BEEP          // 5
    | BEEP BEEP BEEP BEEP               // H
    | BEEP BEEP BEEP BEEP BOOP          // 4
    | BEEP BEEP BEEP                    // S
    | BEEP BEEP BEEP BOOP               // V
    | BEEP BEEP BEEP BOOP BOOP          // 3
    | BEEP BEEP                         // I
    | BEEP BEEP BOOP BEEP               // F
    | BEEP BEEP BOOP                    // U
    | BEEP BEEP BOOP BOOP BEEP BEEP     // Question mark (?)
    | BEEP BEEP BOOP BOOP BEEP BOOP     // Underscore (_)
    | BEEP BEEP BOOP BOOP BOOP          // 2
    | BEEP                              // E
    | BEEP BOOP BEEP BEEP BEEP          // Ampersand (&)
    | BEEP BOOP BEEP BEEP               // L
    | BEEP BOOP BEEP BEEP BOOP BEEP     // Quote (")
    | BEEP BOOP BEEP                    // R
    | BEEP BOOP BEEP BOOP BEEP BOOP     // Period (.)
    | BEEP BOOP BEEP BOOP BEEP          // Plus (+)
    | BEEP BOOP                         // A
    | BEEP BOOP BOOP BEEP BOOP BEEP     // At sign (@)
    | BEEP BOOP BOOP BEEP               // P
    | BEEP BOOP BOOP                    // W
    | BEEP BOOP BOOP BOOP BOOP BEEP     // Apostrophe (')
    | BEEP BOOP BOOP BOOP BOOP          // 1
    | BEEP BOOP BOOP BOOP               // J

    | BOOP BEEP BEEP BEEP BEEP BOOP     // Hyphen (-)
    | BOOP BEEP BEEP BEEP BEEP          // 6
    | BOOP BEEP BEEP BEEP               // B
    | BOOP BEEP BEEP BEEP BOOP          // Equal (=)
    | BOOP BEEP BEEP                    // D
    | BOOP BEEP BEEP BOOP BEEP          // Slash (/)
    | BOOP BEEP BEEP BOOP               // X
    | BOOP BEEP                         // N
    | BOOP BEEP BOOP BEEP               // C
    | BOOP BEEP BOOP BEEP BOOP BEEP     // Semicolon (;)
    | BOOP BEEP BOOP BEEP BOOP BOOP     // Exclamation (!)
    | BOOP BEEP BOOP                    // K
    | BOOP BEEP BOOP BOOP BEEP BOOP     // Parenthesis )
    | BOOP BEEP BOOP BOOP BEEP          // Parenthesis (
    | BOOP BEEP BOOP BOOP               // Y
    | BOOP                              // T
    | BOOP BOOP BEEP BEEP BEEP          // 7
    | BOOP BOOP BEEP BOOP               // Z
    | BOOP BOOP BEEP BEEP BOOP BOOP     // Comma (,)
    | BOOP BOOP BEEP                    // G
    | BOOP BOOP BEEP BOOP               // Q
    | BOOP BOOP                         // M
    | BOOP BOOP BOOP BEEP BEEP BEEP     // Colon (:)
    | BOOP BOOP BOOP BEEP BEEP          // 8
    | BOOP BOOP BOOP                    // O
    | BOOP BOOP BOOP BOOP BEEP          // 9
    | BOOP BOOP BOOP BOOP BOOP          // 0
    ;

// Keywords for lexer
BEEP: 'beep' ;
BOOP: 'boop' ;

DOT: '.' ;
DASH: '-' ;

DIT: 'dit' ;
DAH: 'dah' ;

SYMBOL_SEPARATOR: ' ' ;
CHARACTER_SEPARATOR: '   ' ;
WORD_SEPARATOR: '       ' ;

LINE_COMMENT : '//' .*? '\n' -> skip ;
WS : [ \t\n\r]+ -> skip ;
