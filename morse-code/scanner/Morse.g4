grammar Morse;

/** The start rule: begin parsing here. */
message: word (WORD_SEPARATOR word)* EOF;

// Parser rules
word: character (CHARACTER_SEPARATOR character)* ;
character
    : short
    | long
    | happy
    ;

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
    : DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT                               // 5
    | DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT                                                    // H
    | DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH                               // 4
    | DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT                                                                         // S
    | DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH                                                    // V
    | DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH                               // 3
    | DIT SYMBOL_SEPARATOR DIT                                                                                              // I
    | DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT                                                    // F
    | DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH                                                                         // U
    | DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT          // Question mark (?)
    | DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH          // Underscore (_)
    | DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH                               // 2
    | DIT                                                                                                                   // E
    | DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT                               // Ampersand (&)
    | DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT                                                    // L
    | DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT          // Quote (")
    | DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT                                                                         // R
    | DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH          // Period (.)
    | DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT                               // Plus (+)
    | DIT SYMBOL_SEPARATOR DAH                                                                                              // A
    | DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT          // At sign (@)
    | DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT                                                    // P
    | DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH                                                                         // W
    | DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT          // Apostrophe (')
    | DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH                               // 1
    | DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH                                                    // J

    | DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH          // Hyphen (-)
    | DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT                               // 6
    | DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT                                                    // B
    | DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH                               // Equal (=)
    | DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT                                                                         // D
    | DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT                               // Slash (/)
    | DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH                                                    // X
    | DAH SYMBOL_SEPARATOR DIT                                                                                              // N
    | DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT                                                    // C
    | DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT          // Semicolon (;)
    | DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH          // Exclamation (!)
    | DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH                                                                         // K
    | DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH          // Parenthesis )
    | DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT                               // Parenthesis (
    | DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH                                                    // Y
    | DAH                                                                                                                   // T
    | DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT                               // 7
    | DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH                                                    // Z
    | DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH          // Comma (,)
    | DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT                                                                         // G
    | DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DAH                                                    // Q
    | DAH SYMBOL_SEPARATOR DAH                                                                                              // M
    | DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT          // Colon (:)
    | DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT SYMBOL_SEPARATOR DIT                               // 8
    | DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH                                                                         // O
    | DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DIT                               // 9
    | DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH SYMBOL_SEPARATOR DAH                               // 0
    ;

happy
    :  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP                                 // 5
    |  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP                                                        // H
    |  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP                                 // 4
    |  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP                                                                               // S
    |  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP                                                        // V
    |  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP                                 // 3
    |  BEEP SYMBOL_SEPARATOR  BEEP                                                                                                      // I
    |  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP                                                        // F
    |  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP                                                                               // U
    |  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP          // Question mark (?)
    |  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP          // Underscore (_)
    |  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP                                 // 2
    |  BEEP                                                                                                                             // E
    |  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP                                 // Ampersand (&)
    |  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP                                                        // L
    |  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP          // Quote (")
    |  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP                                                                               // R
    |  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP          // Period (.)
    |  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP                                 // Plus (+)
    |  BEEP SYMBOL_SEPARATOR  BOOP                                                                                                      // A
    |  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP          // At sign (@)
    |  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP                                                        // P
    |  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP                                                                               // W
    |  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP          // Apostrophe (')
    |  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP                                 // 1
    |  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP                                                        // J

    |  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP          // Hyphen (-)
    |  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP                                 // 6
    |  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP                                                        // B
    |  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP                                 // Equal (=)
    |  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP                                                                               // D
    |  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP                                 // Slash (/)
    |  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP                                                        // X
    |  BOOP SYMBOL_SEPARATOR  BEEP                                                                                                      // N
    |  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP                                                        // C
    |  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP          // Semicolon (;)
    |  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP          // Exclamation (!)
    |  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP                                                                               // K
    |  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP          // Parenthesis )
    |  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP                                 // Parenthesis (
    |  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP                                                        // Y
    |  BOOP                                                                                                                             // T
    |  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP                                 // 7
    |  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP                                                        // Z
    |  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP          // Comma (,)
    |  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP                                                                               // G
    |  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BOOP                                                        // Q
    |  BOOP SYMBOL_SEPARATOR  BOOP                                                                                                      // M
    |  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP          // Colon (:)
    |  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP SYMBOL_SEPARATOR  BEEP                                 // 8
    |  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP                                                                               // O
    |  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BEEP                                 // 9
    |  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP SYMBOL_SEPARATOR  BOOP                                 // 0
    ;

signals : signal+ ;

signal
    : small
    | big
    | huge
    ;

small
    : DOT | DASH
    ;

big
    : DIT | DAH
    | SYMBOL_SEPARATOR
    ;

huge
    : BEEP | BOOP
    | SYMBOL_SEPARATOR
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
