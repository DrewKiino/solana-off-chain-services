"use strict";
/* eslint-disable @typescript-eslint/no-redeclare */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedInfo = void 0;
var superstruct_1 = require("superstruct");
exports.ParsedInfo = (0, superstruct_1.type)({
    type: (0, superstruct_1.string)(),
    info: (0, superstruct_1.any)(),
});
