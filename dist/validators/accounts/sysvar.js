"use strict";
/* eslint-disable @typescript-eslint/no-redeclare */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SysvarAccount = exports.SysvarStakeHistoryAccount = exports.StakeHistoryInfo = exports.StakeHistoryEntry = exports.StakeHistoryEntryItem = exports.SysvarSlotHistoryAccount = exports.SlotHistoryInfo = exports.SysvarSlotHashesAccount = exports.SlotHashesInfo = exports.SlotHashEntry = exports.SysvarRewardsAccount = exports.RewardsInfo = exports.SysvarRentAccount = exports.RentInfo = exports.SysvarRecentBlockhashesAccount = exports.RecentBlockhashesInfo = exports.RecentBlockhashesEntry = exports.SysvarFeesAccount = exports.FeesInfo = exports.SysvarEpochScheduleAccount = exports.EpochScheduleInfo = exports.SysvarClockAccount = exports.ClockAccountInfo = exports.SysvarAccountType = void 0;
var superstruct_1 = require("superstruct");
exports.SysvarAccountType = (0, superstruct_1.enums)([
    "clock",
    "epochSchedule",
    "fees",
    "recentBlockhashes",
    "rent",
    "rewards",
    "slotHashes",
    "slotHistory",
    "stakeHistory",
]);
exports.ClockAccountInfo = (0, superstruct_1.type)({
    slot: (0, superstruct_1.number)(),
    epoch: (0, superstruct_1.number)(),
    leaderScheduleEpoch: (0, superstruct_1.number)(),
    unixTimestamp: (0, superstruct_1.number)(),
});
exports.SysvarClockAccount = (0, superstruct_1.type)({
    type: (0, superstruct_1.literal)("clock"),
    info: exports.ClockAccountInfo,
});
exports.EpochScheduleInfo = (0, superstruct_1.type)({
    slotsPerEpoch: (0, superstruct_1.number)(),
    leaderScheduleSlotOffset: (0, superstruct_1.number)(),
    warmup: (0, superstruct_1.boolean)(),
    firstNormalEpoch: (0, superstruct_1.number)(),
    firstNormalSlot: (0, superstruct_1.number)(),
});
exports.SysvarEpochScheduleAccount = (0, superstruct_1.type)({
    type: (0, superstruct_1.literal)("epochSchedule"),
    info: exports.EpochScheduleInfo,
});
exports.FeesInfo = (0, superstruct_1.type)({
    feeCalculator: (0, superstruct_1.type)({
        lamportsPerSignature: (0, superstruct_1.string)(),
    }),
});
exports.SysvarFeesAccount = (0, superstruct_1.type)({
    type: (0, superstruct_1.literal)("fees"),
    info: exports.FeesInfo,
});
exports.RecentBlockhashesEntry = (0, superstruct_1.type)({
    blockhash: (0, superstruct_1.string)(),
    feeCalculator: (0, superstruct_1.type)({
        lamportsPerSignature: (0, superstruct_1.string)(),
    }),
});
exports.RecentBlockhashesInfo = (0, superstruct_1.array)(exports.RecentBlockhashesEntry);
exports.SysvarRecentBlockhashesAccount = (0, superstruct_1.type)({
    type: (0, superstruct_1.literal)("recentBlockhashes"),
    info: exports.RecentBlockhashesInfo,
});
exports.RentInfo = (0, superstruct_1.type)({
    lamportsPerByteYear: (0, superstruct_1.string)(),
    exemptionThreshold: (0, superstruct_1.number)(),
    burnPercent: (0, superstruct_1.number)(),
});
exports.SysvarRentAccount = (0, superstruct_1.type)({
    type: (0, superstruct_1.literal)("rent"),
    info: exports.RentInfo,
});
exports.RewardsInfo = (0, superstruct_1.type)({
    validatorPointValue: (0, superstruct_1.number)(),
});
exports.SysvarRewardsAccount = (0, superstruct_1.type)({
    type: (0, superstruct_1.literal)("rewards"),
    info: exports.RewardsInfo,
});
exports.SlotHashEntry = (0, superstruct_1.type)({
    slot: (0, superstruct_1.number)(),
    hash: (0, superstruct_1.string)(),
});
exports.SlotHashesInfo = (0, superstruct_1.array)(exports.SlotHashEntry);
exports.SysvarSlotHashesAccount = (0, superstruct_1.type)({
    type: (0, superstruct_1.literal)("slotHashes"),
    info: exports.SlotHashesInfo,
});
exports.SlotHistoryInfo = (0, superstruct_1.type)({
    nextSlot: (0, superstruct_1.number)(),
    bits: (0, superstruct_1.string)(),
});
exports.SysvarSlotHistoryAccount = (0, superstruct_1.type)({
    type: (0, superstruct_1.literal)("slotHistory"),
    info: exports.SlotHistoryInfo,
});
exports.StakeHistoryEntryItem = (0, superstruct_1.type)({
    effective: (0, superstruct_1.number)(),
    activating: (0, superstruct_1.number)(),
    deactivating: (0, superstruct_1.number)(),
});
exports.StakeHistoryEntry = (0, superstruct_1.type)({
    epoch: (0, superstruct_1.number)(),
    stakeHistory: exports.StakeHistoryEntryItem,
});
exports.StakeHistoryInfo = (0, superstruct_1.array)(exports.StakeHistoryEntry);
exports.SysvarStakeHistoryAccount = (0, superstruct_1.type)({
    type: (0, superstruct_1.literal)("stakeHistory"),
    info: exports.StakeHistoryInfo,
});
exports.SysvarAccount = (0, superstruct_1.union)([
    exports.SysvarClockAccount,
    exports.SysvarEpochScheduleAccount,
    exports.SysvarFeesAccount,
    exports.SysvarRecentBlockhashesAccount,
    exports.SysvarRentAccount,
    exports.SysvarRewardsAccount,
    exports.SysvarSlotHashesAccount,
    exports.SysvarSlotHistoryAccount,
    exports.SysvarStakeHistoryAccount,
]);
