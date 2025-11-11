const NUMERIC_REGULAR_EXPRESSION = /^\d*$/;
const ALPHANUMERIC_REGULAR_EXPRESSION = /^[\dA-Z $%*+-./:]*$/;
const BYTE_REGULAR_EXPRESSION = /^[\x00-\xff]*$/;
const KANJI_KANA_REGULAR_EXPRESSION = /^[\p{Script_Extensions=Han}\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}]*$/u;

const POSITION_MARKER_SIZE: number = 7;
const ALIGNMENT_PATTERN_SIZE: number = 5;
const POSITION_MARKER_CENTER: number = 3;
const ALIGNMENT_PATTERN_CENTER: number = 2;

const NUMERIC_GROUP_SIZE: number = 3;
const ALPHANUMERIC_GROUP_SIZE: number = 2;
const ALPHANUMERIC_MULTIPLIER: number = 45;

const BITS_IN_BYTE: number = 8;
const BITS_IN_KANJI: number = 13;

const ERROR_CORRECTION_LEVEL = {
    LOW: 1,
    MEDIUM: 0,
    QUARTILE: 3,
    HIGH: 2
};

const FIELD_SIZE: number = 256;
const FIELD_MODULO: number = 285; // 0b100011101

const FORMAT_DATA_LENGTH: number = 5;
const FORMAT_ERROR_LENGTH: number = 10;
const FORMAT_GOLAY: number = 1335; // 0b10100110111
const FORMAT_MASK: number = 21522; // 0b101010000010010

const VERSION_DATA_LENGTH: number = 6;
const VERSION_ERROR_LENGTH: number = 12;
const VERSION_GOLAY: number = 7973; // 0b1111100100101

const QUIET_ZONE_SIZE: number = 4;

const ENCODING = {
    NUMERIC: 0,
    ALPHANUMERIC: 1,
    BYTE: 2,
    KANJI: 3,
    ECI: 7
};

const VERSION = {
    MIN: 1,
    MAX: 40
};
const VERSION_MULTIPLIER: number = 4;

const PENALTY = {
    CONSECUTIVE_FIVE: 3,
    CONSECUTIVE_FIVE_PLUS: 1,
    SAME_TWO_CROSS_TWO: 3,
    FINDER_PATTERN_SIMILARITY: 40,
    UNEVEN_RATIO: 10,
};

const SIMILARITY_PATTERN: number[] = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];

const CHARACTER_COUNT = {
    RANGES: [
        {
            MIN: 1,
            MAX: 9
        },
        {
            MIN: 10,
            MAX: 26
        },
        {
            MIN: 27,
            MAX: 40
        }
    ],
    BITS: [
        // 1-9, 10-26,  27-40 //
        10, 12, 14, // Numeric
        9,  11, 13, // Alphanumeric
        8,  16, 16, // Byte
        8,  10, 12, // Kanji-Kana
    ]
};

// Reference: ? Pending
// TODO: present calculations
const CHARACTER_CAPACITY = [
    // Numeric, Alphanumeric, Byte, Kanji-Kana
    // Version 1
    41, 25, 17, 10, // L
    34, 20, 14, 8,  // M
    27, 16, 11, 7,  // Q
    17, 10, 7,  4,  // H

    // Version 2
    77, 47, 32, 20, // L
    63, 38, 26, 16, // M
    48, 29, 20, 12, // Q
    34, 20, 14, 8,  // H

    // Version 3
    127,    77, 53, 32, // L
    101,    61, 42, 26, // M
    77, 47, 32, 20, // Q
    58, 35, 24, 15, // H

    // Version 4
    187,    114,    78, 48, // L
    149,    90, 62, 38, // M
    111,    67, 46, 28, // Q
    82, 50, 34, 21, // H

    // Version 5
    255,    154,    106,    65, // L
    202,    122,    84, 52, // M
    144,    87, 60, 37, // Q
    106,    64, 44, 27, // H

    // Version 6
    322,    195,    134,    82, // L
    255,    154,    106,    65, // M
    178,    108,    74, 45, // Q
    139,    84, 58, 36, // H

    // Version 7
    370,    224,    154,    95, // L
    293,    178,    122,    75, // M
    207,    125,    86, 53, // Q
    154,    93, 64, 39, // H

    // Version 8
    461,    279,    192,    118,    // L
    365,    221,    152,    93, // M
    259,    157,    108,    66, // Q
    202,    122,    84, 52, // H

    // Version 9
    552,    335,    230,    141,    // L
    432,    262,    180,    111,    // M
    312,    189,    130,    80, // Q
    235,    143,    98, 60, // H

    // Version 10
    652,    395,    271,    167,    // L
    513,    311,    213,    131,    // M
    364,    221,    151,    93, // Q
    288,    174,    119,    74, // H

    // Version 11
    772,    468,    321,    198,    // L
    604,    366,    251,    155,    // M
    427,    259,    177,    109,    // Q
    331,    200,    137,    85, // H

    // Version 12
    883,    535,    367,    226,    // L
    691,    419,    287,    177,    // M
    489,    296,    203,    125,    // Q
    374,    227,    155,    96, // H

    // Version 13
    1022,   619,    425,    262,    // L
    796,    483,    331,    204,    // M
    580,    352,    241,    149,    // Q
    427,    259,    177,    109,    // H

    // Version 14
    1101,   667,    458,    282,    // L
    871,    528,    362,    223,    // M
    621,    376,    258,    159,    // Q
    468,    283,    194,    120,    // H

    // Version 15
    1250,   758,    520,    320,    // L
    991,    600,    412,    254,    // M
    703,    426,    292,    180,    // Q
    530,    321,    220,    136,    // H

    // Version 16
    1408,   854,    586,    361,    // L
    1082,   656,    450,    277,    // M
    775,    470,    322,    198,    // Q
    602,    365,    250,    154,    // H

    // Version 17
    1548,   938,    644,    397,    // L
    1212,   734,    504,    310,    // M
    876,    531,    364,    224,    // Q
    674,    408,    280,    173,    // H

    // Version 18
    1725,   1046,   718,    442,    // L
    1346,   816,    560,    345,    // M
    948,    574,    394,    243,    // Q
    746,    452,    310,    191,    // H

    // Version 19
    1903,   1153,   792,    488,    // L
    1500,   909,    624,    384,    // M
    1063,   644,    442,    272,    // Q
    813,    493,    338,    208,    // H

    // Version 20
    2061,   1249,   858,    528,    // L
    1600,   970,    666,    410,    // M
    1159,   702,    482,    297,    // Q
    919,    557,    382,    235,    // H

    // Version 21
    2232,   1352,   929,    572,    // L
    1708,   1035,   711,    438,    // M
    1224,   742,    509,    314,    // Q
    969,    587,    403,    248,    // H

    // Version 22
    2409,   1460,   1003,   618,    // L
    1872,   1134,   779,    480,    // M
    1358,   823,    565,    348,    // Q
    1056,   640,    439,    270,    // H

    // Version 23
    2620,   1588,   1091,   672,    // L
    2059,   1248,   857,    528,    // M
    1468,   890,    611,    376,    // Q
    1108,   672,    461,    284,    // H

    // Version 24
    2812,   1704,   1171,   721,    // L
    2188,   1326,   911,    561,    // M
    1588,   963,    661,    407,    // Q
    1228,   744,    511,    315,    // H

    // Version 25
    3057,   1853,   1273,   784,    // L
    2395,   1451,   997,    614,    // M
    1718,   1041,   715,    440,    // Q
    1286,   779,    535,    330,    // H

    // Version 26
    3283,   1990,   1367,   842,    // L
    2544,   1542,   1059,   652,    // M
    1804,   1094,   751,    462,    // Q
    1425,   864,    593,    365,    // H

    // Version 27
    3517,   2132,   1465,   902,    // L
    2701,   1637,   1125,   692,    // M
    1933,   1172,   805,    496,    // Q
    1501,   910,    625,    385,    // H

    // Version 28
    3669,   2223,   1528,   940,    // L
    2857,   1732,   1190,   732,    // M
    2085,   1263,   868,    534,    // Q
    1581,   958,    658,    405,    // H

    // Version 29
    3909,   2369,   1628,   1002,   // L
    3035,   1839,   1264,   778,    // M
    2181,   1322,   908,    559,    // Q
    1677,   1016,   698,    430,    // H

    // Version 30
    4158,   2520,   1732,   1066,   // L
    3289,   1994,   1370,   843,    // M
    2358,   1429,   982,    604,    // Q
    1782,   1080,   742,    457,    // H

    // Version 31
    4417,   2677,   1840,   1132,   // L
    3486,   2113,   1452,   894,    // M
    2473,   1499,   1030,   634,    // Q
    1897,   1150,   790,    486,    // H

    // Version 32
    4686,   2840,   1952,   1201,   // L
    3693,   2238,   1538,   947,    // M
    2670,   1618,   1112,   684,    // Q
    2022,   1226,   842,    518,    // H

    // Version 33
    4965,   3009,   2068,   1273,   // L
    3909,   2369,   1628,   1002,   // M
    2805,   1700,   1168,   719,    // Q
    2157,   1307,   898,    553,    // H

    // Version 34
    5253,   3183,   2188,   1347,   // L
    4134,   2506,   1722,   1060,   // M
    2949,   1787,   1228,   756,    // Q
    2301,   1394,   958,    590,    // H

    // Version 35
    5529,   3351,   2303,   1417,   // L
    4343,   2632,   1809,   1113,   // M
    3081,   1867,   1283,   790,    // Q
    2361,   1431,   983,    605,    // H

    // Version 36
    5836,   3537,   2431,   1496,   // L
    4588,   2780,   1911,   1176,   // M
    3244,   1966,   1351,   832,    // Q
    2524,   1530,   1051,   647,    // H

    // Version 37
    6153,   3729,   2563,   1577,   // L
    4775,   2894,   1989,   1224,   // M
    3417,   2071,   1423,   876,    // Q
    2625,   1591,   1093,   673,    // H

    // Version 38
    6479,   3927,   2699,   1661,   // L
    5039,   3054,   2099,   1292,   // M
    3599,   2181,   1499,   923,    // Q
    2735,   1658,   1139,   701,    // H

    // Version 39
    6743,   4087,   2809,   1729,   // L
    5313,   3220,   2213,   1362,   // M
    3791,   2298,   1579,   972,    // Q
    2927,   1774,   1219,   750,    // H

    // Version 40
    7089,   4296,   2953,   1817,   // L
    5596,   3391,   2331,   1435,   // M
    3993,   2420,   1663,   1024,   // Q
    3057,   1852,   1273,   784,    // H
];

const MIXED_DATA_BITS = [
    // L,   M,      Q,      H //
    152,    128,    104,    72,     // Version 1
    272,    224,    176,    128,    // Version 2
    440,    352,    272,    208,    // Version 3
    640,    512,    384,    288,    // Version 4
    864,    688,    496,    368,    // Version 5
    1088,   864,    608,    480,    // Version 6
    1248,   992,    704,    528,    // Version 7
    1552,   1232,   880,    688,    // Version 8
    1856,   1456,   1056,   800,    // Version 9
    2192,   1728,   1232,   976,    // Version 10
    2592,   2032,   1440,   1120,   // Version 11
    2960,   2320,   1648,   1264,   // Version 12
    3424,   2672,   1952,   1440,   // Version 13
    3688,   2920,   2088,   1576,   // Version 14
    4184,   3320,   2360,   1784,   // Version 15
    4712,   3624,   2600,   2024,   // Version 16
    5176,   4056,   2936,   2264,   // Version 17
    5768,   4504,   3176,   2504,   // Version 18
    6360,   5016,   3560,   2728,   // Version 19
    6888,   5352,   3880,   3080,   // Version 20
    7456,   5712,   4096,   3248,   // Version 21
    8048,   6256,   4544,   3536,   // Version 22
    8752,   6880,   4912,   3712,   // Version 23
    9392,   7312,   5312,   4112,   // Version 24
    10208,  8000,   5744,   4304,   // Version 25
    10960,  8496,   6032,   4768,   // Version 26
    11744,  9024,   6464,   5024,   // Version 27
    12248,  9544,   6968,   5288,   // Version 28
    13048,  10136,  7288,   5608,   // Version 29
    13880,  10984,  7880,   5960,   // Version 30
    14744,  11640,  8264,   6344,   // Version 31
    15640,  12328,  8920,   6760,   // Version 32
    16568,  13048,  9368,   7208,   // Version 33
    17528,  13800,  9848,   7688,   // Version 34
    18448,  14496,  10288,  7888,   // Version 35
    19472,  15312,  10832,  8432,   // Version 36
    20528,  15936,  11408,  8768,   // Version 37
    21616,  16816,  12016,  9136,   // Version 38
    22496,  17728,  12656,  9776,   // Version 39
    23648,  18672,  13328,  10208,  // Version 40
];

const BLOCK_COUNT = {
    GROUP_ONE: [
        // L,   M,  Q,  H //
        1,  1,  1,  1,  // Version 1
        1,  1,  1,  1,  // Version 2
        1,  1,  2,  2,  // Version 3
        1,  2,  2,  4,  // Version 4
        1,  2,  2,  2,  // Version 5
        2,  4,  4,  4,  // Version 6
        2,  4,  2,  4,  // Version 7
        2,  2,  4,  4,  // Version 8
        2,  3,  4,  4,  // Version 9
        2,  4,  6,  6,  // Version 10
        4,  1,  4,  3,  // Version 11
        2,  6,  4,  7,  // Version 12
        4,  8,  8,  12, // Version 13
        3,  4,  11, 11, // Version 14
        5,  5,  5,  11, // Version 15
        5,  7,  15, 3,  // Version 16
        1,  10, 1,  2,  // Version 17
        5,  9,  17, 2,  // Version 18
        3,  3,  17, 9,  // Version 19
        3,  3,  15, 15, // Version 20
        4,  17, 17, 19, // Version 21
        2,  17, 7,  34, // Version 22
        4,  4,  11, 16, // Version 23
        6,  6,  11, 30, // Version 24
        8,  8,  7,  22, // Version 25
        10, 19, 28, 33, // Version 26
        8,  22, 8,  12, // Version 27
        3,  3,  4,  11, // Version 28
        7,  21, 1,  19, // Version 29
        5,  19, 15, 23, // Version 30
        13, 2,  42, 23, // Version 31
        17, 10, 10, 19, // Version 32
        17, 14, 29, 11, // Version 33
        13, 14, 44, 59, // Version 34
        12, 12, 39, 22, // Version 35
        6,  6,  46, 2,  // Version 36
        17, 29, 49, 24, // Version 37
        4,  13, 48, 42, // Version 38
        20, 40, 43, 10, // Version 39
        19, 18, 34, 20, // Version 40
    ],

    GROUP_TWO: [
        // L,   M,  Q,  H //
        0,  0,  0,  0,  // Version 1
        0,  0,  0,  0,  // Version 2
        0,  0,  0,  0,  // Version 3
        0,  0,  0,  0,  // Version 4
        0,  0,  2,  2,  // Version 5
        0,  0,  0,  0,  // Version 6
        0,  0,  4,  1,  // Version 7
        0,  2,  2,  2,  // Version 8
        0,  2,  4,  4,  // Version 9
        2,  1,  2,  2,  // Version 10
        0,  4,  4,  8,  // Version 11
        2,  2,  6,  4,  // Version 12
        0,  1,  4,  4,  // Version 13
        1,  5,  5,  5,  // Version 14
        1,  5,  7,  7,  // Version 15
        1,  3,  2,  13, // Version 16
        5,  1,  15, 17, // Version 17
        1,  4,  1,  19, // Version 18
        4,  11, 4,  16, // Version 19
        5,  13, 5,  10, // Version 20
        4,  0,  6,  6,  // Version 21
        7,  0,  16, 0,  // Version 22
        5,  14, 14, 14, // Version 23
        4,  14, 16, 2,  // Version 24
        4,  13, 22, 13, // Version 25
        2,  4,  6,  4,  // Version 26
        4,  3,  26, 28, // Version 27
        10, 23, 31, 31, // Version 28
        7,  7,  37, 26, // Version 29
        10, 10, 25, 25, // Version 30
        3,  29, 1,  28, // Version 31
        0,  23, 35, 35, // Version 32
        1,  21, 19, 46, // Version 33
        6,  23, 7,  1,  // Version 34
        7,  26, 14, 41, // Version 35
        14, 34, 10, 64, // Version 36
        4,  14, 10, 46, // Version 37
        18, 32, 14, 32, // Version 38
        4,  7,  22, 67, // Version 39
        6,  31, 34, 61, // Version 40
    ]
};

const CODEWORD_COUNT = {
    GROUP_ONE: [
        // L,   M,  Q,  H //
        19, 16, 13, 9,  // Version 1
        34, 28, 22, 16, // Version 2
        55, 44, 17, 13, // Version 3
        80, 32, 24, 9,  // Version 4
        108,    43, 15, 11, // Version 5
        68, 27, 19, 15, // Version 6
        78, 31, 14, 13, // Version 7
        97, 38, 18, 14, // Version 8
        116,    36, 16, 12, // Version 9
        68, 43, 19, 15, // Version 10
        81, 50, 22, 12, // Version 11
        92, 36, 20, 14, // Version 12
        107,    37, 20, 11, // Version 13
        115,    40, 16, 12, // Version 14
        87, 41, 24, 12, // Version 15
        98, 45, 19, 15, // Version 16
        107,    46, 22, 14, // Version 17
        120,    43, 22, 14, // Version 18
        113,    44, 21, 13, // Version 19
        107,    41, 24, 15, // Version 20
        116,    42, 22, 16, // Version 21
        111,    46, 24, 13, // Version 22
        121,    47, 24, 15, // Version 23
        117,    45, 24, 16, // Version 24
        106,    47, 24, 15, // Version 25
        114,    46, 22, 16, // Version 26
        122,    45, 23, 15, // Version 27
        117,    45, 24, 15, // Version 28
        116,    45, 23, 15, // Version 29
        115,    47, 24, 15, // Version 30
        115,    46, 24, 15, // Version 31
        115,    46, 24, 15, // Version 32
        115,    46, 24, 15, // Version 33
        115,    46, 24, 16, // Version 34
        121,    47, 24, 15, // Version 35
        121,    47, 24, 15, // Version 36
        122,    46, 24, 15, // Version 37
        122,    46, 24, 15, // Version 38
        117,    47, 24, 15, // Version 39
        118,    47, 24, 15, // Version 40
    ],

    GROUP_TWO: [
        // L,   M,  Q,  H //
        0,  0,  0,  0,  // Version 1
        0,  0,  0,  0,  // Version 2
        0,  0,  0,  0,  // Version 3
        0,  0,  0,  0,  // Version 4
        0,  0,  16, 12, // Version 5
        0,  0,  0,  0,  // Version 6
        0,  0,  15, 14, // Version 7
        0,  39, 19, 15, // Version 8
        0,  37, 17, 13, // Version 9
        69, 44, 20, 16, // Version 10
        0,  51, 23, 13, // Version 11
        93, 37, 21, 15, // Version 12
        0,  38, 21, 12, // Version 13
        116,    41, 17, 13, // Version 14
        88, 42, 25, 13, // Version 15
        99, 46, 20, 16, // Version 16
        108,    47, 23, 15, // Version 17
        121,    44, 23, 15, // Version 18
        114,    45, 22, 14, // Version 19
        108,    42, 25, 16, // Version 20
        117,    0,  23, 17, // Version 21
        112,    0,  25, 0,  // Version 22
        122,    48, 25, 16, // Version 23
        118,    46, 25, 17, // Version 24
        107,    48, 25, 16, // Version 25
        115,    47, 23, 17, // Version 26
        123,    46, 24, 16, // Version 27
        118,    46, 25, 16, // Version 28
        117,    46, 24, 16, // Version 29
        116,    48, 25, 16, // Version 30
        116,    47, 25, 16, // Version 31
        0,  47, 25, 16, // Version 32
        116,    47, 25, 16, // Version 33
        116,    47, 25, 17, // Version 34
        122,    48, 25, 16, // Version 35
        122,    48, 25, 16, // Version 36
        123,    47, 25, 16, // Version 37
        123,    47, 25, 16, // Version 38
        118,    48, 25, 16, // Version 39
        119,    48, 25, 16, // Version 40
    ]
};

const ERROR_CORRECTION_CODEWORDS_PER_BLOCK = [
    // L,   M,  Q,  H //
    7,  10, 13, 17, // Version 1
    10, 16, 22, 28, // Version 2
    15, 26, 18, 22, // Version 3
    20, 18, 26, 16, // Version 4
    26, 24, 18, 22, // Version 5
    18, 16, 24, 28, // Version 6
    20, 18, 18, 26, // Version 7
    24, 22, 22, 26, // Version 8
    30, 22, 20, 24, // Version 9
    18, 26, 24, 28, // Version 10
    20, 30, 28, 24, // Version 11
    24, 22, 26, 28, // Version 12
    26, 22, 24, 22, // Version 13
    30, 24, 20, 24, // Version 14
    22, 24, 30, 24, // Version 15
    24, 28, 24, 30, // Version 16
    28, 28, 28, 28, // Version 17
    30, 26, 28, 28, // Version 18
    28, 26, 26, 26, // Version 19
    28, 26, 30, 28, // Version 20
    28, 26, 28, 30, // Version 21
    28, 28, 30, 24, // Version 22
    30, 28, 30, 30, // Version 23
    30, 28, 30, 30, // Version 24
    26, 28, 30, 30, // Version 25
    28, 28, 28, 30, // Version 26
    30, 28, 30, 30, // Version 27
    30, 28, 30, 30, // Version 28
    30, 28, 30, 30, // Version 29
    30, 28, 30, 30, // Version 30
    30, 28, 30, 30, // Version 31
    30, 28, 30, 30, // Version 32
    30, 28, 30, 30, // Version 33
    30, 28, 30, 30, // Version 34
    30, 28, 30, 30, // Version 35
    30, 28, 30, 30, // Version 36
    30, 28, 30, 30, // Version 37
    30, 28, 30, 30, // Version 38
    30, 28, 30, 30, // Version 39
    30, 28, 30, 30, // Version 40
];
