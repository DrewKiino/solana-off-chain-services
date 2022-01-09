"use strict";
/* eslint-disable @typescript-eslint/no-redeclare */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteAccount = exports.VoteAccountInfo = exports.Vote = exports.EpochCredits = exports.PriorVoter = exports.AuthorizedVoter = exports.VoteAccountType = void 0;
var superstruct_1 = require("superstruct");
var pubkey_1 = require("../pubkey");
exports.VoteAccountType = (0, superstruct_1.enums)(["vote"]);
exports.AuthorizedVoter = (0, superstruct_1.type)({
    authorizedVoter: pubkey_1.PublicKeyFromString,
    epoch: (0, superstruct_1.number)(),
});
exports.PriorVoter = (0, superstruct_1.type)({
    authorizedPubkey: pubkey_1.PublicKeyFromString,
    epochOfLastAuthorizedSwitch: (0, superstruct_1.number)(),
    targetEpoch: (0, superstruct_1.number)(),
});
exports.EpochCredits = (0, superstruct_1.type)({
    epoch: (0, superstruct_1.number)(),
    credits: (0, superstruct_1.string)(),
    previousCredits: (0, superstruct_1.string)(),
});
exports.Vote = (0, superstruct_1.type)({
    slot: (0, superstruct_1.number)(),
    confirmationCount: (0, superstruct_1.number)(),
});
exports.VoteAccountInfo = (0, superstruct_1.type)({
    authorizedVoters: (0, superstruct_1.array)(exports.AuthorizedVoter),
    authorizedWithdrawer: pubkey_1.PublicKeyFromString,
    commission: (0, superstruct_1.number)(),
    epochCredits: (0, superstruct_1.array)(exports.EpochCredits),
    lastTimestamp: (0, superstruct_1.type)({
        slot: (0, superstruct_1.number)(),
        timestamp: (0, superstruct_1.number)(),
    }),
    nodePubkey: pubkey_1.PublicKeyFromString,
    priorVoters: (0, superstruct_1.array)(exports.PriorVoter),
    rootSlot: (0, superstruct_1.nullable)((0, superstruct_1.number)()),
    votes: (0, superstruct_1.array)(exports.Vote),
});
exports.VoteAccount = (0, superstruct_1.type)({
    type: exports.VoteAccountType,
    info: exports.VoteAccountInfo,
});
