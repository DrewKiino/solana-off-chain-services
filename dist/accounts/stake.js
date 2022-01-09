"use strict";
/* eslint-disable @typescript-eslint/no-redeclare */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakeAccount = exports.StakeAccountInfo = exports.StakeMeta = exports.StakeAccountType = void 0;
var superstruct_1 = require("superstruct");
var bignum_1 = require("../validators/bignum");
var pubkey_1 = require("../validators/pubkey");
exports.StakeAccountType = (0, superstruct_1.enums)([
    "uninitialized",
    "initialized",
    "delegated",
    "rewardsPool",
]);
exports.StakeMeta = (0, superstruct_1.type)({
    rentExemptReserve: bignum_1.BigNumFromString,
    authorized: (0, superstruct_1.type)({
        staker: pubkey_1.PublicKeyFromString,
        withdrawer: pubkey_1.PublicKeyFromString,
    }),
    lockup: (0, superstruct_1.type)({
        unixTimestamp: (0, superstruct_1.number)(),
        epoch: (0, superstruct_1.number)(),
        custodian: pubkey_1.PublicKeyFromString,
    }),
});
exports.StakeAccountInfo = (0, superstruct_1.type)({
    meta: exports.StakeMeta,
    stake: (0, superstruct_1.nullable)((0, superstruct_1.type)({
        delegation: (0, superstruct_1.type)({
            voter: pubkey_1.PublicKeyFromString,
            stake: bignum_1.BigNumFromString,
            activationEpoch: bignum_1.BigNumFromString,
            deactivationEpoch: bignum_1.BigNumFromString,
            warmupCooldownRate: (0, superstruct_1.number)(),
        }),
        creditsObserved: (0, superstruct_1.number)(),
    })),
});
exports.StakeAccount = (0, superstruct_1.type)({
    type: exports.StakeAccountType,
    info: exports.StakeAccountInfo,
});
