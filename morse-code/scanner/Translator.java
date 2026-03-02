import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.*;

import java.util.HashMap;
import java.util.Map;

// Listener is better in comparison to Visitor for simple translation.
public class Translator extends MorseBaseListener {
    private StringBuilder message = new StringBuilder();
    private StringBuilder word = new StringBuilder();
    private StringBuilder character = new StringBuilder();

    private static final Map<String, String> ENGLISH = new HashMap<String, String>();
    
    static {
        ENGLISH.put("._", "A");
        ENGLISH.put("dit dah", "A");
        ENGLISH.put("beep boop", "A");
        
        ENGLISH.put("-...", "B");
        ENGLISH.put("dah dit dit dit", "A");
        ENGLISH.put("boop beep beep beep", "B");

        ENGLISH.put("-.-.", "C");
        ENGLISH.put("dah dit dah dit", "C");
        ENGLISH.put("boop beep boop beep", "C");

        ENGLISH.put("-..", "D");
        ENGLISH.put("dah dit dit", "D");
        ENGLISH.put("boop beep beep", "D");

        ENGLISH.put(".", "E");
        ENGLISH.put("dit", "E");
        ENGLISH.put("beep", "E");

        ENGLISH.put("..-.", "F");
        ENGLISH.put("dit dit dah dit", "F");
        ENGLISH.put("beep beep boop beep", "F");

        ENGLISH.put("--.", "G");
        ENGLISH.put("dah dah dit", "G");
        ENGLISH.put("boop boop beep", "G");

        ENGLISH.put("....", "H");
        ENGLISH.put("dit dit dit dit", "H");
        ENGLISH.put("beep beep beep beep", "H");
        
        ENGLISH.put("..", "I");
        ENGLISH.put("dit dit", "I");
        ENGLISH.put("beep beep", "I");

        ENGLISH.put(".---", "J");
        ENGLISH.put("dit dah dah dah", "J");
        ENGLISH.put("beep boop boop boop", "J");

        ENGLISH.put("-.-", "K");
        ENGLISH.put("dah dit dah", "K");
        ENGLISH.put("boop beep boop", "K");

        ENGLISH.put(".-..", "L");
        ENGLISH.put("dit dah dit dit", "L");
        ENGLISH.put("beep boop beep beep", "L");
        
        ENGLISH.put("--", "M");
        ENGLISH.put("dah dah", "M");
        ENGLISH.put("boop boop", "M");

        ENGLISH.put("-.", "N");
        ENGLISH.put("dah dit", "N");
        ENGLISH.put("boop beep", "N");

        ENGLISH.put("---", "O");
        ENGLISH.put("dah dah dah", "O");
        ENGLISH.put("boop boop boop", "O");

        ENGLISH.put(".--.", "P");
        ENGLISH.put("dit dah dah dit", "P");
        ENGLISH.put("beep boop boop beep", "P");

        ENGLISH.put("--.-", "Q");
        ENGLISH.put("dah dah dit dah", "Q");
        ENGLISH.put("boop boop beep boop", "Q");

        ENGLISH.put(".-.", "R");
        ENGLISH.put("dit dah dit", "R");
        ENGLISH.put("beep boop beep", "R");

        ENGLISH.put("...", "S");
        ENGLISH.put("dit dit dit", "S");
        ENGLISH.put("beep beep beep", "S");

        ENGLISH.put("-", "T");
        ENGLISH.put("dah", "T");
        ENGLISH.put("boop", "T");

        ENGLISH.put("..-", "U");
        ENGLISH.put("dit dit dah", "U");
        ENGLISH.put("beep beep boop", "U");

        ENGLISH.put("...-", "V");
        ENGLISH.put("dit dit dit dah", "V");
        ENGLISH.put("beep beep beep boop", "V");

        ENGLISH.put(".--", "W");
        ENGLISH.put("dit dah dah", "W");
        ENGLISH.put("beep boop boop", "W");

        ENGLISH.put("-..-", "X");
        ENGLISH.put("dah dit dit dah", "X");
        ENGLISH.put("boop beep beep boop", "X");

        ENGLISH.put("-.--", "Y");
        ENGLISH.put("dah dit dah dah", "Y");
        ENGLISH.put("boop beep boop boop", "Y");

        ENGLISH.put("--..", "Z");
        ENGLISH.put("dah dah dit dit", "Z");
        ENGLISH.put("boop boop beep beep", "Z");

        ENGLISH.put("-----", "0");
        ENGLISH.put("dah dah dah dah dah", "0");
        ENGLISH.put("boop boop boop boop boop", "0");

        ENGLISH.put(".----", "1");
        ENGLISH.put("dit dah dah dah dah", "1");
        ENGLISH.put("beep boop boop boop boop", "1");
        
        ENGLISH.put("..---", "2");
        ENGLISH.put("dit dit dah dah dah", "2");
        ENGLISH.put("beep beep boop boop boop", "2");

        ENGLISH.put("...--", "3");
        ENGLISH.put("dit dit dit dah dah", "3");
        ENGLISH.put("beep beep beep boop boop", "3");

        ENGLISH.put("....--", "4");
        ENGLISH.put("dit dit dit dit dah dah", "4");
        ENGLISH.put("beep beep beep beep boop boop", "4");

        ENGLISH.put(".....", "5");
        ENGLISH.put("dit dit dit dit dit", "5");
        ENGLISH.put("beep beep beep beep beep", "5");

        ENGLISH.put("-....", "6");
        ENGLISH.put("dah dit dit dit dit", "6");
        ENGLISH.put("boop beep beep beep beep", "6");

        ENGLISH.put("--...", "7");
        ENGLISH.put("dah dah dit dit dit", "7");
        ENGLISH.put("boop boop beep beep beep", "7");

        ENGLISH.put("---..", "8");
        ENGLISH.put("dah dah dah dit dit", "8");
        ENGLISH.put("boop boop boop beep beep", "8");

        ENGLISH.put("----.", "9");
        ENGLISH.put("dah dah dah dah dit", "9");
        ENGLISH.put("boop boop boop boop beep", "9");

        ENGLISH.put(".-.-.-", ".");
        ENGLISH.put("dit dah dit dah dit dah", ".");
        ENGLISH.put("beep boop beep boop beep boop", ".");

        ENGLISH.put("--..--", ",");
        ENGLISH.put("dah dah dit dit dah dah", ",");
        ENGLISH.put("boop boop beep beep boop boop", ",");

        ENGLISH.put("..--..", "?");
        ENGLISH.put("dit dit dah dah dit dit", "?");
        ENGLISH.put("beep beep boop boop beep beep", "?");

        ENGLISH.put(".----.", "'");
        ENGLISH.put("dit dah dah dah dah dit", "'");
        ENGLISH.put("beep boop boop boop boop beep", "'");

        ENGLISH.put("-.-.--", "!");
        ENGLISH.put("dah dit dah dit dah dah", "!");
        ENGLISH.put("boop beep boop beep boop boop", "!");

        ENGLISH.put("-..-.", "/");
        ENGLISH.put("dah dit dit dah dit", "/");
        ENGLISH.put("boop beep beep boop beep", "/");

        ENGLISH.put("-.--.", "(");
        ENGLISH.put("dah dit dah dah dit", "(");
        ENGLISH.put("boop beep boop boop beep", "(");

        ENGLISH.put("-.--.-", ")");
        ENGLISH.put("dah dit dah dah dit dah", ")");
        ENGLISH.put("boop beep boop boop beep boop", ")");

        ENGLISH.put(".-...", "&");
        ENGLISH.put("dit dah dit dit dit", "&");
        ENGLISH.put("beep boop beep beep beep", "&");

        ENGLISH.put("---...", ":");
        ENGLISH.put("dah dah dah dit dit dit", ":");
        ENGLISH.put("boop boop boop beep beep beep", ":");

        ENGLISH.put("-.-.-.", ";");
        ENGLISH.put("dah dit dah dit dah dit", ";");
        ENGLISH.put("boop beep boop beep boop beep", ";");

        ENGLISH.put("-...-", "=");
        ENGLISH.put("dah dit dit dit dah", "=");
        ENGLISH.put("boop beep beep beep boop", "=");

        ENGLISH.put(".-.-.", "+");
        ENGLISH.put("dit dah dit dah dit", "+");
        ENGLISH.put("beep boop beep boop beep", "+");

        ENGLISH.put("-....-", "-");
        ENGLISH.put("dah dit dit dit dit dah", "-");
        ENGLISH.put("boop beep beep beep beep boop", "-");

        ENGLISH.put("..--.-", "_");
        ENGLISH.put("dit dit dah dah dit dah", "_");
        ENGLISH.put("beep beep boop boop beep boop", "_");

        ENGLISH.put(".-..-.", "\"");
        ENGLISH.put("dit dah dit dit dah dit", "\"");
        ENGLISH.put("beep boop beep beep boop beep", "\"");

        ENGLISH.put(".--.-.", "@");
        ENGLISH.put("dit dah dah dit dah dit", "@");
        ENGLISH.put("beep boop boop beep boop beep", "@");

        // TODO: fill sequentially
        // TODO: alphabet, digits, punctuations
    }

    @Override public void exitSignal(MorseParser.SignalContext ctx) {
        character.append(ctx.getText());
    }

    @Override public void exitCharacter(MorseParser.CharacterContext ctx) {
        // lower case for unknown and uppercase otherwise
        System.out.println(character.toString());
        word.append(ENGLISH.getOrDefault(character.toString(), "<unk>"));
        character.setLength(0);
    }

    @Override public void exitWord(MorseParser.WordContext ctx) {
        if (word.length() > 0) {
            message.append(' ');
        }

        message.append(word.toString());
        word.setLength(0);
    }

    public String getTranslation() {
        return message.toString();
    }
}
