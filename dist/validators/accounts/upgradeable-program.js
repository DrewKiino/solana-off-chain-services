"use strict";
/* eslint-disable @typescript-eslint/no-redeclare */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpgradeableLoaderAccount = exports.ProgramUninitializedAccount = exports.ProgramUninitializedAccountInfo = exports.ProgramBufferAccount = exports.ProgramBufferAccountInfo = exports.ProgramDataAccount = exports.ProgramDataAccountInfo = exports.ProgramAccount = exports.ProgramAccountInfo = void 0;
var superstruct_1 = require("superstruct");
var __1 = require("..");
var pubkey_1 = require("../pubkey");
exports.ProgramAccountInfo = (0, superstruct_1.type)({
    programData: pubkey_1.PublicKeyFromString,
});
exports.ProgramAccount = (0, superstruct_1.type)({
    type: (0, superstruct_1.literal)("program"),
    info: exports.ProgramAccountInfo,
});
exports.ProgramDataAccountInfo = (0, superstruct_1.type)({
    authority: (0, superstruct_1.nullable)(pubkey_1.PublicKeyFromString),
    // don't care about data yet
    slot: (0, superstruct_1.number)(),
});
exports.ProgramDataAccount = (0, superstruct_1.type)({
    type: (0, superstruct_1.literal)("programData"),
    info: exports.ProgramDataAccountInfo,
});
exports.ProgramBufferAccountInfo = (0, superstruct_1.type)({
    authority: (0, superstruct_1.nullable)(pubkey_1.PublicKeyFromString),
    // don't care about data yet
});
exports.ProgramBufferAccount = (0, superstruct_1.type)({
    type: (0, superstruct_1.literal)("buffer"),
    info: exports.ProgramBufferAccountInfo,
});
exports.ProgramUninitializedAccountInfo = (0, superstruct_1.any)();
exports.ProgramUninitializedAccount = (0, superstruct_1.type)({
    type: (0, superstruct_1.literal)("uninitialized"),
    info: exports.ProgramUninitializedAccountInfo,
});
exports.UpgradeableLoaderAccount = (0, superstruct_1.coerce)((0, superstruct_1.union)([
    exports.ProgramAccount,
    exports.ProgramDataAccount,
    exports.ProgramBufferAccount,
    exports.ProgramUninitializedAccount,
]), __1.ParsedInfo, function (value) {
    // Coercions like `PublicKeyFromString` are not applied within
    // union validators so we use this custom coercion as a workaround.
    switch (value.type) {
        case "program": {
            return {
                type: value.type,
                info: (0, superstruct_1.create)(value.info, exports.ProgramAccountInfo),
            };
        }
        case "programData": {
            return {
                type: value.type,
                info: (0, superstruct_1.create)(value.info, exports.ProgramDataAccountInfo),
            };
        }
        case "buffer": {
            return {
                type: value.type,
                info: (0, superstruct_1.create)(value.info, exports.ProgramBufferAccountInfo),
            };
        }
        case "uninitialized": {
            return {
                type: value.type,
                info: (0, superstruct_1.create)(value.info, exports.ProgramUninitializedAccountInfo),
            };
        }
        default: {
            throw new Error("Unknown program account type: " + value.type);
        }
    }
});
