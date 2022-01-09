"use strict";
/* eslint-disable @typescript-eslint/no-redeclare */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenAccount = exports.MultisigAccountInfo = exports.MintAccountInfo = exports.TokenAccountInfo = exports.TokenAccountType = void 0;
var superstruct_1 = require("superstruct");
var pubkey_1 = require("./pubkey");
exports.TokenAccountType = (0, superstruct_1.enums)(["mint", "account", "multisig"]);
var AccountState = (0, superstruct_1.enums)(["initialized", "uninitialized", "frozen"]);
var TokenAmount = (0, superstruct_1.type)({
    decimals: (0, superstruct_1.number)(),
    uiAmountString: (0, superstruct_1.string)(),
    amount: (0, superstruct_1.string)(),
});
exports.TokenAccountInfo = (0, superstruct_1.type)({
    mint: pubkey_1.PublicKeyFromString,
    owner: pubkey_1.PublicKeyFromString,
    tokenAmount: TokenAmount,
    delegate: (0, superstruct_1.optional)(pubkey_1.PublicKeyFromString),
    state: AccountState,
    isNative: (0, superstruct_1.boolean)(),
    rentExemptReserve: (0, superstruct_1.optional)(TokenAmount),
    delegatedAmount: (0, superstruct_1.optional)(TokenAmount),
    closeAuthority: (0, superstruct_1.optional)(pubkey_1.PublicKeyFromString),
});
exports.MintAccountInfo = (0, superstruct_1.type)({
    mintAuthority: (0, superstruct_1.nullable)(pubkey_1.PublicKeyFromString),
    supply: (0, superstruct_1.string)(),
    decimals: (0, superstruct_1.number)(),
    isInitialized: (0, superstruct_1.boolean)(),
    freezeAuthority: (0, superstruct_1.nullable)(pubkey_1.PublicKeyFromString),
});
exports.MultisigAccountInfo = (0, superstruct_1.type)({
    numRequiredSigners: (0, superstruct_1.number)(),
    numValidSigners: (0, superstruct_1.number)(),
    isInitialized: (0, superstruct_1.boolean)(),
    signers: (0, superstruct_1.array)(pubkey_1.PublicKeyFromString),
});
exports.TokenAccount = (0, superstruct_1.type)({
    type: exports.TokenAccountType,
    info: (0, superstruct_1.any)(),
});
