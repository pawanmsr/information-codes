function getEncoding(data: string) {
    if (NUMERIC_REGULAR_EXPRESSION.test(data)) {
        return 0b0001;
    }

    if (ALPHANUMERIC_REGULAR_EXPRESSION.test(data)) {
        return 0b0010;
    }

    if (BYTE_REGULAR_EXPRESSION.test(data)) {
        return 0b0100;
    }

    if (KANJI_KANA_REGULAR_EXPRESSION.test(data)) {
        return 0b1000;
    }

    return 0b0111;
}
