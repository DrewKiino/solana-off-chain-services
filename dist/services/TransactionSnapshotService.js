"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.processNewTransaction = exports.performTransactionSignaturesBackFill = exports.performTransactionSignaturesFrontFill = exports.performEntireTransactionSignaturesScrape = void 0;
var Web3 = __importStar(require("@solana/web3.js"));
var token_1 = require("../validators/token");
var superstruct_1 = require("superstruct");
var validators_1 = require("../validators");
var AccountRepository = __importStar(require("../repositories/AccountRepository"));
var Cron = __importStar(require("node-cron"));
var TransactionRepository = __importStar(require("../repositories/TransactionRepository"));
var TransactionToAccountRepository = __importStar(require("../repositories/TransactionToAccountRepository"));
var util_1 = require("../util/util");
var QueueService_1 = require("./QueueService");
function performEntireTransactionSignaturesScrape(connection, publicKey) {
    return __awaiter(this, void 0, void 0, function () {
        var loggerId, account, results, genesisTransaction, limit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loggerId = (0, util_1.makeLoggerId)();
                    return [4 /*yield*/, AccountRepository.upsert({ address: publicKey.toBase58() })
                        /// Then fetch the genesis Transaction
                    ];
                case 1:
                    account = _a.sent();
                    return [4 /*yield*/, connection.getConfirmedSignaturesForAddress2(publicKey, { limit: 1 })];
                case 2:
                    results = _a.sent();
                    if (results.length == 0) {
                        return [2 /*return*/, console.log(loggerId + ": there are no transactions for this account " + publicKey.toBase58())];
                    }
                    genesisTransaction = results[0];
                    console.log(loggerId + ": ADDRESS " + publicKey.toBase58() + " -- begin scraping with genesis TRANSACTION " + genesisTransaction.signature);
                    limit = 1000;
                    performTransactionSignaturesFrontFill(connection, account, genesisTransaction, 5, limit);
                    return [2 /*return*/];
            }
        });
    });
}
exports.performEntireTransactionSignaturesScrape = performEntireTransactionSignaturesScrape;
function performTransactionSignaturesFrontFill(connection, lookUpAccount, genesisTransaction, interval, limit) {
    var _this = this;
    var publicKey = new Web3.PublicKey(lookUpAccount.address);
    var loggerId = (0, util_1.makeLoggerId)();
    var cronExpression = "*/" + interval + " * * * * *";
    var isTaskInProgress = false;
    var cron = Cron.schedule(cronExpression, function () { return __awaiter(_this, void 0, void 0, function () {
        var latest, untilSignature, signatures, earliest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isTaskInProgress)
                        return [2 /*return*/];
                    isTaskInProgress = true;
                    return [4 /*yield*/, TransactionToAccountRepository.findLatestByAddress(lookUpAccount.address)];
                case 1:
                    latest = _a.sent();
                    untilSignature = (latest === null || latest === void 0 ? void 0 : latest.signature) || genesisTransaction.signature;
                    console.log(loggerId + ": ADDRESS " + publicKey.toBase58() + " -- " + limit + "(N) <== " + untilSignature);
                    return [4 /*yield*/, connection.getConfirmedSignaturesForAddress2(publicKey, {
                            limit: limit,
                            until: untilSignature
                        })];
                case 2:
                    signatures = _a.sent();
                    return [4 /*yield*/, processSignatures(loggerId, publicKey, lookUpAccount, genesisTransaction, signatures, false)];
                case 3:
                    earliest = _a.sent();
                    if (!earliest) {
                        isTaskInProgress = false;
                        return [2 /*return*/, console.log(loggerId + ": ADDRESS " + publicKey.toBase58() + " -- no more recent transactions")];
                    }
                    console.log(loggerId + ": ADDRESS " + publicKey.toBase58() + " -- " + ((earliest === null || earliest === void 0 ? void 0 : earliest.signature) || 'NULL') + " <== " + ((latest === null || latest === void 0 ? void 0 : latest.signature) || 'NULL'));
                    isTaskInProgress = false;
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.performTransactionSignaturesFrontFill = performTransactionSignaturesFrontFill;
function performTransactionSignaturesBackFill(connection, lookUpAccount, genesisTransaction, interval, limit) {
    var _this = this;
    var publicKey = new Web3.PublicKey(lookUpAccount.address);
    var loggerId = (0, util_1.makeLoggerId)();
    var cronExpression = "*/" + interval + " * * * * *";
    var isTaskInProgress = false;
    var cron;
    cron = Cron.schedule(cronExpression, function () { return __awaiter(_this, void 0, void 0, function () {
        var earliest, untilSignature, signatures, latest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isTaskInProgress)
                        return [2 /*return*/];
                    isTaskInProgress = true;
                    return [4 /*yield*/, TransactionToAccountRepository.findEarliestByAddress(lookUpAccount.address)];
                case 1:
                    earliest = _a.sent();
                    untilSignature = (earliest === null || earliest === void 0 ? void 0 : earliest.signature) || genesisTransaction.signature;
                    console.log(loggerId + ": ADDRESS " + publicKey.toBase58() + " -- " + untilSignature + " ==> " + limit + "(N)");
                    return [4 /*yield*/, connection.getConfirmedSignaturesForAddress2(publicKey, {
                            limit: limit,
                            before: untilSignature
                        })];
                case 2:
                    signatures = _a.sent();
                    return [4 /*yield*/, processSignatures(loggerId, publicKey, lookUpAccount, genesisTransaction, signatures, true)];
                case 3:
                    latest = _a.sent();
                    if (!latest) {
                        isTaskInProgress = false;
                        /// We've reached the end of the transaction history
                        /// we can stop now =)
                        cron.stop();
                        return [2 /*return*/, console.log(loggerId + ": ADDRESS " + publicKey.toBase58() + " -- no more later transactions")];
                    }
                    console.log(loggerId + ": ADDRESS " + publicKey.toBase58() + " -- " + ((earliest === null || earliest === void 0 ? void 0 : earliest.signature) || 'NULL') + " ==> " + ((latest === null || latest === void 0 ? void 0 : latest.signature) || 'NULL'));
                    isTaskInProgress = false;
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.performTransactionSignaturesBackFill = performTransactionSignaturesBackFill;
function processSignatures(loggerId, publicKey, lookUpAccount, genesisTransaction, signatures, isBackFill) {
    return __awaiter(this, void 0, void 0, function () {
        var cachedPromises, cachedResults, cachedSignatures, _i, cachedResults_1, result, transactionPromises, _a, signatures_1, signature, results, transactionToAccountPromises, transactionToProcessPromises, _b, results_1, result, transactionToAccountResults;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (signatures.length == 0) {
                        console.log(loggerId + ": ADDRESS " + publicKey.toBase58() + " -- no more " + (isBackFill ? 'later' : 'recent') + " signatures found");
                        return [2 /*return*/, undefined];
                    }
                    console.log(loggerId + ": ADDRESS " + publicKey.toBase58() + " -- " + signatures.length + " signatures found");
                    cachedPromises = signatures.map(function (signature) {
                        return TransactionToAccountRepository.findOneTransactionByTransactionSignatureAndAccountId(signature.signature, lookUpAccount.id);
                    });
                    return [4 /*yield*/, Promise.all(cachedPromises)];
                case 1:
                    cachedResults = _c.sent();
                    cachedSignatures = new Set();
                    for (_i = 0, cachedResults_1 = cachedResults; _i < cachedResults_1.length; _i++) {
                        result = cachedResults_1[_i];
                        if (!result)
                            continue;
                        cachedSignatures.add(result.signature);
                    }
                    console.log(loggerId + ": ADDRESS " + publicKey.toBase58() + " -- " + cachedSignatures.size + " signatures cached");
                    transactionPromises = [];
                    for (_a = 0, signatures_1 = signatures; _a < signatures_1.length; _a++) {
                        signature = signatures_1[_a];
                        if (cachedSignatures.has(signature.signature))
                            continue;
                        transactionPromises.push(TransactionRepository.upsert(signature));
                    }
                    if (transactionPromises.length == 0)
                        return [2 /*return*/, undefined];
                    return [4 /*yield*/, Promise.all(transactionPromises)];
                case 2:
                    results = _c.sent();
                    if (results.length == 0)
                        return [2 /*return*/, undefined];
                    transactionToAccountPromises = [];
                    transactionToProcessPromises = [];
                    for (_b = 0, results_1 = results; _b < results_1.length; _b++) {
                        result = results_1[_b];
                        transactionToAccountPromises.push(TransactionToAccountRepository.upsert(lookUpAccount.id, result.id));
                        transactionToProcessPromises.push(processNewTransaction(result));
                    }
                    return [4 /*yield*/, Promise.all(transactionToAccountPromises)];
                case 3:
                    transactionToAccountResults = _c.sent();
                    return [4 /*yield*/, Promise.all(transactionToProcessPromises)];
                case 4:
                    _c.sent();
                    console.log(loggerId + ": ADDRESS " + publicKey.toBase58() + " -- " + transactionPromises.length + " signatures new");
                    if (transactionToAccountResults.length == 0)
                        return [2 /*return*/, undefined];
                    if (isBackFill)
                        return [2 /*return*/, results.pop()];
                    return [2 /*return*/, results[0]];
            }
        });
    });
}
function processNewTransaction(transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var job;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    job = QueueService_1.newTransactionQueue.createJob(transaction);
                    return [4 /*yield*/, job.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.processNewTransaction = processNewTransaction;
function performCronJob(callback) {
    var _this = this;
    var interval = 3;
    var limit = 1000;
    var loggerId = Math.floor(Math.random() * 100000);
    var cronExpression = "*/" + interval + " * * * * *";
    var isTaskInProgress = false;
    var cron;
    cron = Cron.schedule(cronExpression, function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isTaskInProgress)
                        return [2 /*return*/];
                    isTaskInProgress = true;
                    return [4 /*yield*/, callback()];
                case 1:
                    _a.sent();
                    isTaskInProgress = false;
                    return [2 /*return*/];
            }
        });
    }); });
}
function createParsedAccountInfo(parsedData) {
    try {
        var data = (0, superstruct_1.create)(parsedData.parsed, validators_1.ParsedInfo);
        var parsed = (0, superstruct_1.create)(data, token_1.TokenAccount);
        return (0, superstruct_1.create)(parsed.info, token_1.TokenAccountInfo);
    }
    catch (error) {
        throw error;
    }
}
