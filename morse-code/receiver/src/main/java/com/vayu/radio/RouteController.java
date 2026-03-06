package com.vayu.radio;

import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.tree.ParseTree;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.tree.ParseTreeWalker;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class RouteController {
    private StringBuilder morseCode = new StringBuilder();

    RouteController() {}

    @CrossOrigin
    @GetMapping("/")
    String home() {
        return "APIs: /morse /plaintext.";
    }

    @CrossOrigin
	@PostMapping("/morse")
	String translate(@RequestBody MorseMessage message) {
        morseCode.append(message.getContent());
        // TODO: check for null data
		return "Get translation from /plaintext!";
	}

    @CrossOrigin
    @GetMapping("/plaintext")
    String transmit() {
        CharStream charStream = CharStreams.fromString(morseCode.toString());

        MorseLexer lexer = new MorseLexer(charStream);
        CommonTokenStream tokens = new CommonTokenStream(lexer);
        MorseParser parser = new MorseParser(tokens);

        ParseTree tree = parser.message();
        ParseTreeWalker walker = new ParseTreeWalker();
        Translator listener = new Translator();

        walker.walk(listener, tree);
        String translation = listener.getTranslation();

        morseCode.setLength(0);
        return translation;
    }
}
