package com.vayu.radio;

import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.tree.ParseTree;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.tree.ParseTreeWalker;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class BroadcastMessage {
    private String time;
    private String sender;
    private String content;

    public BroadcastMessage(String sender, String content) {
        this.sender = sender;

        CharStream charStream = CharStreams.fromString(content);

        MorseLexer lexer = new MorseLexer(charStream);
        CommonTokenStream tokens = new CommonTokenStream(lexer);
        MorseParser parser = new MorseParser(tokens);

        ParseTree tree = parser.message();
        ParseTreeWalker walker = new ParseTreeWalker();
        Translator listener = new Translator();

        walker.walk(listener, tree);

        this.content = listener.getTranslation();
        
        this.time = LocalDateTime.now().format(
            DateTimeFormatter.ofPattern("HH:mm:ss")
        );
    }

    public String getSender() {
        return sender;
    }
    
    public String getContent() {
        return content;
    }
    
    public String getTime() {
        return time;
    }
}
