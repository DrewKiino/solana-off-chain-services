"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicKeyFromString = void 0;
var superstruct_1 = require("superstruct");
var web3_js_1 = require("@solana/web3.js");
exports.PublicKeyFromString = (0, superstruct_1.coerce)((0, superstruct_1.instance)(web3_js_1.PublicKey), (0, superstruct_1.string)(), function (value) { return new web3_js_1.PublicKey(value); });
