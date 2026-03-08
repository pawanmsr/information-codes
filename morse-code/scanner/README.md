Lexical Analyser
================

Scanner for morse code using ANTLR4.

Instructions
------------

1. Antlr-tools to generate lexer and parser.
2. ANTLR4 to compile and run the lexer and parser.

```shell
antlr4 Scanner.g4

# add class path while compiling java programs
javac -cp antlr-4.13.2-complete.jar *.java
java -cp .:antlr-4.13.2-complete.jar org.antlr.v4.gui.TestRig Scanner < test.txt
java -cp .:antlr-4.13.2-complete.jar Scanner < test.txt

# alternatively export the CLASS_PATH
#   as an environment variable

```
