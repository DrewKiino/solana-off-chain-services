"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigNumFromString = void 0;
var superstruct_1 = require("superstruct");
var bn_js_1 = __importDefault(require("bn.js"));
exports.BigNumFromString = (0, superstruct_1.coerce)((0, superstruct_1.instance)(bn_js_1.default), (0, superstruct_1.string)(), function (value) {
    if (typeof value === "string")
        return new bn_js_1.default(value, 10);
    throw new Error("invalid big num");
});
