// Generated from Morse.g4 by ANTLR 4.13.2
import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link MorseParser}.
 */
public interface MorseListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link MorseParser#message}.
	 * @param ctx the parse tree
	 */
	void enterMessage(MorseParser.MessageContext ctx);
	/**
	 * Exit a parse tree produced by {@link MorseParser#message}.
	 * @param ctx the parse tree
	 */
	void exitMessage(MorseParser.MessageContext ctx);
	/**
	 * Enter a parse tree produced by {@link MorseParser#word}.
	 * @param ctx the parse tree
	 */
	void enterWord(MorseParser.WordContext ctx);
	/**
	 * Exit a parse tree produced by {@link MorseParser#word}.
	 * @param ctx the parse tree
	 */
	void exitWord(MorseParser.WordContext ctx);
	/**
	 * Enter a parse tree produced by {@link MorseParser#character}.
	 * @param ctx the parse tree
	 */
	void enterCharacter(MorseParser.CharacterContext ctx);
	/**
	 * Exit a parse tree produced by {@link MorseParser#character}.
	 * @param ctx the parse tree
	 */
	void exitCharacter(MorseParser.CharacterContext ctx);
	/**
	 * Enter a parse tree produced by {@link MorseParser#short}.
	 * @param ctx the parse tree
	 */
	void enterShort(MorseParser.ShortContext ctx);
	/**
	 * Exit a parse tree produced by {@link MorseParser#short}.
	 * @param ctx the parse tree
	 */
	void exitShort(MorseParser.ShortContext ctx);
	/**
	 * Enter a parse tree produced by {@link MorseParser#long}.
	 * @param ctx the parse tree
	 */
	void enterLong(MorseParser.LongContext ctx);
	/**
	 * Exit a parse tree produced by {@link MorseParser#long}.
	 * @param ctx the parse tree
	 */
	void exitLong(MorseParser.LongContext ctx);
	/**
	 * Enter a parse tree produced by {@link MorseParser#happy}.
	 * @param ctx the parse tree
	 */
	void enterHappy(MorseParser.HappyContext ctx);
	/**
	 * Exit a parse tree produced by {@link MorseParser#happy}.
	 * @param ctx the parse tree
	 */
	void exitHappy(MorseParser.HappyContext ctx);
}