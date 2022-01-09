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
exports.fetchAccountHistory = void 0;
function fetchAccountHistory(connection, pubkey, options) {
    return __awaiter(this, void 0, void 0, function () {
        var fetched, history_1, signatures, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, connection.getConfirmedSignaturesForAddress2(pubkey, options)];
                case 1:
                    fetched = _a.sent();
                    history_1 = {
                        fetched: fetched,
                        foundOldest: fetched.length < options.limit,
                    };
                    signatures = history_1.fetched
                        .map(function (signature) { return signature.signature; });
                    return [4 /*yield*/, fetchParsedTransactions(connection, signatures)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, Promise.resolve(undefined)];
            }
        });
    });
}
exports.fetchAccountHistory = fetchAccountHistory;
var MAX_TRANSACTION_BATCH_SIZE = 10;
function fetchParsedTransactions(connection, transactionSignatures) {
    return __awaiter(this, void 0, void 0, function () {
        var transactionMap, _loop_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transactionMap = {};
                    _loop_1 = function () {
                        var signatures, fetched;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    signatures = transactionSignatures.splice(0, MAX_TRANSACTION_BATCH_SIZE);
                                    return [4 /*yield*/, connection.getParsedConfirmedTransactions(signatures)];
                                case 1:
                                    fetched = _b.sent();
                                    fetched.forEach(function (parsed, index) {
                                        if (parsed !== null) {
                                            transactionMap[signatures[index]] = parsed;
                                        }
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!(transactionSignatures.length > 0)) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, transactionMap];
            }
        });
    });
}
