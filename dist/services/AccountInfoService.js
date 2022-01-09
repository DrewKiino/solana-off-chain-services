"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAccountInfo = void 0;
var superstruct_1 = require("superstruct");
var stake_1 = require("../accounts/stake");
var validators_1 = require("../validators");
var config_1 = require("../validators/accounts/config");
var nonce_1 = require("../validators/accounts/nonce");
var sysvar_1 = require("../validators/accounts/sysvar");
var upgradeable_program_1 = require("../validators/accounts/upgradeable-program");
var vote_1 = require("../validators/accounts/vote");
var token_1 = require("../validators/token");
function fetchAccountInfo(connection, pubkey) {
    return __awaiter(this, void 0, void 0, function () {
        var data, result, lamports, details, space, data_1, info, _a, parsed, programData, result_1, info_1, parsed, isDelegated, activation, _b, error_1, error_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 21, , 22]);
                    return [4 /*yield*/, connection.getParsedAccountInfo(pubkey)];
                case 1:
                    result = (_c.sent()).value;
                    lamports = void 0, details = void 0;
                    if (!(result === null)) return [3 /*break*/, 2];
                    lamports = 0;
                    return [3 /*break*/, 20];
                case 2:
                    lamports = result.lamports;
                    space = void 0;
                    if (!("parsed" in result.data)) {
                        space = result.data.length;
                    }
                    else {
                        space = result.data.space;
                    }
                    if (!("parsed" in result.data)) return [3 /*break*/, 19];
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 18, , 19]);
                    info = (0, superstruct_1.create)(result.data.parsed, validators_1.ParsedInfo);
                    _a = result.data.program;
                    switch (_a) {
                        case "bpf-upgradeable-loader": return [3 /*break*/, 4];
                        case "stake": return [3 /*break*/, 7];
                        case "vote": return [3 /*break*/, 11];
                        case "nonce": return [3 /*break*/, 12];
                        case "sysvar": return [3 /*break*/, 13];
                        case "config": return [3 /*break*/, 14];
                        case "spl-token": return [3 /*break*/, 15];
                    }
                    return [3 /*break*/, 16];
                case 4:
                    parsed = (0, superstruct_1.create)(info, upgradeable_program_1.UpgradeableLoaderAccount);
                    programData = void 0;
                    if (!(parsed.type === "program")) return [3 /*break*/, 6];
                    return [4 /*yield*/, connection.getParsedAccountInfo(parsed.info.programData)];
                case 5:
                    result_1 = (_c.sent()).value;
                    if (result_1 &&
                        "parsed" in result_1.data &&
                        result_1.data.program === "bpf-upgradeable-loader") {
                        info_1 = (0, superstruct_1.create)(result_1.data.parsed, validators_1.ParsedInfo);
                        programData = (0, superstruct_1.create)(info_1, upgradeable_program_1.ProgramDataAccount).info;
                    }
                    else {
                        throw new Error("invalid program data account for program: " + pubkey.toBase58());
                    }
                    _c.label = 6;
                case 6:
                    data_1 = {
                        program: result.data.program,
                        parsed: parsed,
                        programData: programData,
                    };
                    return [3 /*break*/, 17];
                case 7:
                    parsed = (0, superstruct_1.create)(info, stake_1.StakeAccount);
                    isDelegated = parsed.type === "delegated";
                    if (!isDelegated) return [3 /*break*/, 9];
                    return [4 /*yield*/, connection.getStakeActivation(pubkey)];
                case 8:
                    _b = _c.sent();
                    return [3 /*break*/, 10];
                case 9:
                    _b = undefined;
                    _c.label = 10;
                case 10:
                    activation = _b;
                    data_1 = {
                        program: result.data.program,
                        parsed: parsed,
                        activation: activation,
                    };
                    return [3 /*break*/, 17];
                case 11:
                    data_1 = {
                        program: result.data.program,
                        parsed: (0, superstruct_1.create)(info, vote_1.VoteAccount),
                    };
                    return [3 /*break*/, 17];
                case 12:
                    data_1 = {
                        program: result.data.program,
                        parsed: (0, superstruct_1.create)(info, nonce_1.NonceAccount),
                    };
                    return [3 /*break*/, 17];
                case 13:
                    data_1 = {
                        program: result.data.program,
                        parsed: (0, superstruct_1.create)(info, sysvar_1.SysvarAccount),
                    };
                    return [3 /*break*/, 17];
                case 14:
                    data_1 = {
                        program: result.data.program,
                        parsed: (0, superstruct_1.create)(info, config_1.ConfigAccount),
                    };
                    return [3 /*break*/, 17];
                case 15:
                    data_1 = {
                        program: result.data.program,
                        parsed: (0, superstruct_1.create)(info, token_1.TokenAccount),
                    };
                    return [3 /*break*/, 17];
                case 16:
                    data_1 = undefined;
                    _c.label = 17;
                case 17: return [3 /*break*/, 19];
                case 18:
                    error_1 = _c.sent();
                    console.log(error_1 + " " + pubkey.toBase58());
                    return [3 /*break*/, 19];
                case 19:
                    details = {
                        space: space,
                        executable: result.executable,
                        owner: result.owner,
                        data: data_1,
                    };
                    _c.label = 20;
                case 20:
                    data = { pubkey: pubkey, lamports: lamports, details: details };
                    return [3 /*break*/, 22];
                case 21:
                    error_2 = _c.sent();
                    console.log(error_2);
                    return [3 /*break*/, 22];
                case 22: return [2 /*return*/, data];
            }
        });
    });
}
exports.fetchAccountInfo = fetchAccountInfo;
