"use strict";
/* eslint-disable @typescript-eslint/no-redeclare */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigAccount = exports.StakeConfigInfoAccount = exports.ValidatorInfoAccount = exports.ValidatorInfoConfigInfo = exports.ValidatorInfoConfigData = exports.ConfigKey = exports.StakeConfigInfo = void 0;
var superstruct_1 = require("superstruct");
exports.StakeConfigInfo = (0, superstruct_1.type)({
    warmupCooldownRate: (0, superstruct_1.number)(),
    slashPenalty: (0, superstruct_1.number)(),
});
exports.ConfigKey = (0, superstruct_1.type)({
    pubkey: (0, superstruct_1.string)(),
    signer: (0, superstruct_1.boolean)(),
});
exports.ValidatorInfoConfigData = (0, superstruct_1.record)((0, superstruct_1.string)(), (0, superstruct_1.string)());
exports.ValidatorInfoConfigInfo = (0, superstruct_1.type)({
    keys: (0, superstruct_1.array)(exports.ConfigKey),
    configData: exports.ValidatorInfoConfigData,
});
exports.ValidatorInfoAccount = (0, superstruct_1.type)({
    type: (0, superstruct_1.literal)("validatorInfo"),
    info: exports.ValidatorInfoConfigInfo,
});
exports.StakeConfigInfoAccount = (0, superstruct_1.type)({
    type: (0, superstruct_1.literal)("stakeConfig"),
    info: exports.StakeConfigInfo,
});
exports.ConfigAccount = (0, superstruct_1.union)([
    exports.StakeConfigInfoAccount,
    exports.ValidatorInfoAccount,
]);
