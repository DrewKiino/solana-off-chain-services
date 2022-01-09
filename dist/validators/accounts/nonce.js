"use strict";
/* eslint-disable @typescript-eslint/no-redeclare */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonceAccount = exports.NonceAccountInfo = exports.NonceAccountType = void 0;
var superstruct_1 = require("superstruct");
var pubkey_1 = require("../pubkey");
exports.NonceAccountType = (0, superstruct_1.enums)(["uninitialized", "initialized"]);
exports.NonceAccountInfo = (0, superstruct_1.type)({
    authority: pubkey_1.PublicKeyFromString,
    blockhash: (0, superstruct_1.string)(),
    feeCalculator: (0, superstruct_1.type)({
        lamportsPerSignature: (0, superstruct_1.string)(),
    }),
});
exports.NonceAccount = (0, superstruct_1.type)({
    type: exports.NonceAccountType,
    info: exports.NonceAccountInfo,
});
