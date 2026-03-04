package com.vayu.radio;

// Generated from Morse.g4 by ANTLR 4.13.2
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast", "CheckReturnValue", "this-escape"})
public class MorseLexer extends Lexer {
	static { RuntimeMetaData.checkVersion("4.13.2", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		BEEP=1, BOOP=2, DOT=3, DASH=4, DIT=5, DAH=6, SYMBOL_SEPARATOR=7, CHARACTER_SEPARATOR=8, 
		WORD_SEPARATOR=9, LINE_COMMENT=10, WS=11;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE"
	};

	private static String[] makeRuleNames() {
		return new String[] {
			"BEEP", "BOOP", "DOT", "DASH", "DIT", "DAH", "SYMBOL_SEPARATOR", "CHARACTER_SEPARATOR", 
			"WORD_SEPARATOR", "LINE_COMMENT", "WS"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "'beep'", "'boop'", "'.'", "'-'", "'dit'", "'dah'", "' '", "'   '", 
			"'       '"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "BEEP", "BOOP", "DOT", "DASH", "DIT", "DAH", "SYMBOL_SEPARATOR", 
			"CHARACTER_SEPARATOR", "WORD_SEPARATOR", "LINE_COMMENT", "WS"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}


	public MorseLexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "Morse.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public String[] getChannelNames() { return channelNames; }

	@Override
	public String[] getModeNames() { return modeNames; }

	@Override
	public ATN getATN() { return _ATN; }

	public static final String _serializedATN =
		"\u0004\u0000\u000bO\u0006\uffff\uffff\u0002\u0000\u0007\u0000\u0002\u0001"+
		"\u0007\u0001\u0002\u0002\u0007\u0002\u0002\u0003\u0007\u0003\u0002\u0004"+
		"\u0007\u0004\u0002\u0005\u0007\u0005\u0002\u0006\u0007\u0006\u0002\u0007"+
		"\u0007\u0007\u0002\b\u0007\b\u0002\t\u0007\t\u0002\n\u0007\n\u0001\u0000"+
		"\u0001\u0000\u0001\u0000\u0001\u0000\u0001\u0000\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0002\u0001\u0002\u0001\u0003"+
		"\u0001\u0003\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0006\u0001\u0006\u0001\u0007"+
		"\u0001\u0007\u0001\u0007\u0001\u0007\u0001\b\u0001\b\u0001\b\u0001\b\u0001"+
		"\b\u0001\b\u0001\b\u0001\b\u0001\t\u0001\t\u0001\t\u0001\t\u0005\t@\b"+
		"\t\n\t\f\tC\t\t\u0001\t\u0001\t\u0001\t\u0001\t\u0001\n\u0004\nJ\b\n\u000b"+
		"\n\f\nK\u0001\n\u0001\n\u0001A\u0000\u000b\u0001\u0001\u0003\u0002\u0005"+
		"\u0003\u0007\u0004\t\u0005\u000b\u0006\r\u0007\u000f\b\u0011\t\u0013\n"+
		"\u0015\u000b\u0001\u0000\u0001\u0003\u0000\t\n\r\r  P\u0000\u0001\u0001"+
		"\u0000\u0000\u0000\u0000\u0003\u0001\u0000\u0000\u0000\u0000\u0005\u0001"+
		"\u0000\u0000\u0000\u0000\u0007\u0001\u0000\u0000\u0000\u0000\t\u0001\u0000"+
		"\u0000\u0000\u0000\u000b\u0001\u0000\u0000\u0000\u0000\r\u0001\u0000\u0000"+
		"\u0000\u0000\u000f\u0001\u0000\u0000\u0000\u0000\u0011\u0001\u0000\u0000"+
		"\u0000\u0000\u0013\u0001\u0000\u0000\u0000\u0000\u0015\u0001\u0000\u0000"+
		"\u0000\u0001\u0017\u0001\u0000\u0000\u0000\u0003\u001c\u0001\u0000\u0000"+
		"\u0000\u0005!\u0001\u0000\u0000\u0000\u0007#\u0001\u0000\u0000\u0000\t"+
		"%\u0001\u0000\u0000\u0000\u000b)\u0001\u0000\u0000\u0000\r-\u0001\u0000"+
		"\u0000\u0000\u000f/\u0001\u0000\u0000\u0000\u00113\u0001\u0000\u0000\u0000"+
		"\u0013;\u0001\u0000\u0000\u0000\u0015I\u0001\u0000\u0000\u0000\u0017\u0018"+
		"\u0005b\u0000\u0000\u0018\u0019\u0005e\u0000\u0000\u0019\u001a\u0005e"+
		"\u0000\u0000\u001a\u001b\u0005p\u0000\u0000\u001b\u0002\u0001\u0000\u0000"+
		"\u0000\u001c\u001d\u0005b\u0000\u0000\u001d\u001e\u0005o\u0000\u0000\u001e"+
		"\u001f\u0005o\u0000\u0000\u001f \u0005p\u0000\u0000 \u0004\u0001\u0000"+
		"\u0000\u0000!\"\u0005.\u0000\u0000\"\u0006\u0001\u0000\u0000\u0000#$\u0005"+
		"-\u0000\u0000$\b\u0001\u0000\u0000\u0000%&\u0005d\u0000\u0000&\'\u0005"+
		"i\u0000\u0000\'(\u0005t\u0000\u0000(\n\u0001\u0000\u0000\u0000)*\u0005"+
		"d\u0000\u0000*+\u0005a\u0000\u0000+,\u0005h\u0000\u0000,\f\u0001\u0000"+
		"\u0000\u0000-.\u0005 \u0000\u0000.\u000e\u0001\u0000\u0000\u0000/0\u0005"+
		" \u0000\u000001\u0005 \u0000\u000012\u0005 \u0000\u00002\u0010\u0001\u0000"+
		"\u0000\u000034\u0005 \u0000\u000045\u0005 \u0000\u000056\u0005 \u0000"+
		"\u000067\u0005 \u0000\u000078\u0005 \u0000\u000089\u0005 \u0000\u0000"+
		"9:\u0005 \u0000\u0000:\u0012\u0001\u0000\u0000\u0000;<\u0005/\u0000\u0000"+
		"<=\u0005/\u0000\u0000=A\u0001\u0000\u0000\u0000>@\t\u0000\u0000\u0000"+
		"?>\u0001\u0000\u0000\u0000@C\u0001\u0000\u0000\u0000AB\u0001\u0000\u0000"+
		"\u0000A?\u0001\u0000\u0000\u0000BD\u0001\u0000\u0000\u0000CA\u0001\u0000"+
		"\u0000\u0000DE\u0005\n\u0000\u0000EF\u0001\u0000\u0000\u0000FG\u0006\t"+
		"\u0000\u0000G\u0014\u0001\u0000\u0000\u0000HJ\u0007\u0000\u0000\u0000"+
		"IH\u0001\u0000\u0000\u0000JK\u0001\u0000\u0000\u0000KI\u0001\u0000\u0000"+
		"\u0000KL\u0001\u0000\u0000\u0000LM\u0001\u0000\u0000\u0000MN\u0006\n\u0000"+
		"\u0000N\u0016\u0001\u0000\u0000\u0000\u0003\u0000AK\u0001\u0006\u0000"+
		"\u0000";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}