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
exports.displayTimestampWithoutDate = exports.displayTimestampUtc = exports.displayTimestamp = void 0;
var DotEnv = __importStar(require("dotenv"));
var Cron = __importStar(require("node-cron"));
var Web3 = __importStar(require("@solana/web3.js"));
var CronTaskService = __importStar(require("./services/CronTaskService"));
var ids_1 = require("./constants/ids");
var TokenSnapshotService = __importStar(require("./services/TokenSnapshotService"));
var TokenBalanceSnapshotService = __importStar(require("./services/TokenAccountSnapshotService"));
var TransactionSnapshotService = __importStar(require("./services/TransactionSnapshotService"));
var TokenAccountRepository = __importStar(require("./repositories/TokenAccountRepository"));
var TokenInfoRepository = __importStar(require("./repositories/TokenInfoRepository"));
var AccountRepository = __importStar(require("./repositories/AccountRepository"));
var SolanaWeb3Service_1 = require("./services/SolanaWeb3Service");
var util_1 = require("./util/util");
var QueueService_1 = require("./services/QueueService");
var spl_token_registry_1 = require("@solana/spl-token-registry");
var AccountInfoService_1 = require("./services/AccountInfoService");
DotEnv.config();
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, testSolana0()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
function startCronJobs() {
    return __awaiter(this, void 0, void 0, function () {
        var cronExpression, taskIdentifier, cron;
        var _this = this;
        return __generator(this, function (_a) {
            cronExpression = '*/3 * * * * *';
            taskIdentifier = 'account_watch';
            cron = Cron.schedule(cronExpression, function () {
                (function () { return __awaiter(_this, void 0, void 0, function () {
                    var allBridgeTokenAddress, allBridgeMarketAddress, snapshot;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                allBridgeTokenAddress = 'a11bdAAuV8iB2fu7X6AxAvDTo1QZ8FXB3kk5eecdasp';
                                allBridgeMarketAddress = 'FrR9FBmiBjm2GjLZbfnCcgkbueUJ78NbBx1qcQKPUQe8';
                                return [4 /*yield*/, TokenSnapshotService.takeSnapshot(SolanaWeb3Service_1.SOLANA_CONNECTION, allBridgeTokenAddress, allBridgeMarketAddress)];
                            case 1:
                                snapshot = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })();
            });
            return [2 /*return*/];
        });
    });
}
function testCron() {
    return __awaiter(this, void 0, void 0, function () {
        var cronExpression, taskIdentifier, cronTask, cron;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cronExpression = '*/3 * * * * *';
                    taskIdentifier = 'account_watch';
                    return [4 /*yield*/, CronTaskService.upsert(cronExpression, taskIdentifier)];
                case 1:
                    cronTask = _a.sent();
                    cron = Cron.schedule(cronExpression, function () {
                        console.log('running a task every 3 seconds');
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function testSolana0() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var connection, ABR_SRM_DEX, TEST_MINT_ID, tokenListProvider, tokenList, tokenInfos, tokenInfoByAddress, _i, tokenInfos_1, tokenInfo, largestTokenAccounts, tokenAccountsByOwnerAddress, tokenAmountByMintAddress, _d, _e, largestTokenAccount, largestTokenAccountInfo, largestTokenAccountInfoData, tokenAccountOwnerPubKey, tokenAccountsPromiseTimeout, tokenAccountsPromise, results, tokenAccounts, _f, tokenAccounts_1, tokenAccount, tokenAccountPubKey, parsedInfo, tokenMintPubKey, tokenInfo, tokenMintResult, parsedTokenMintInfo, tokenSupply, tokenAccountAmount, tokenAccountAmountDistribution, key, previousTokenAmount, totalTokenAmount, tokenAccountEntity, tokenMintAccountEntity, tokenOwnerAccountEntity, tokenInfoEntity, result;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    connection = new Web3.Connection(process.env.SOLANA_RPC || "", 
                    // Web3.clusterApiUrl("devnet"),
                    'confirmed');
                    ABR_SRM_DEX = (0, ids_1.toPublicKey)('FrR9FBmiBjm2GjLZbfnCcgkbueUJ78NbBx1qcQKPUQe8');
                    TEST_MINT_ID = (0, ids_1.toPublicKey)('orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE');
                    tokenListProvider = new spl_token_registry_1.TokenListProvider();
                    return [4 /*yield*/, tokenListProvider.resolve(spl_token_registry_1.Strategy.CDN)];
                case 1:
                    tokenList = _g.sent();
                    tokenInfos = tokenList.filterByChainId(101).getList();
                    tokenInfoByAddress = {};
                    for (_i = 0, tokenInfos_1 = tokenInfos; _i < tokenInfos_1.length; _i++) {
                        tokenInfo = tokenInfos_1[_i];
                        tokenInfoByAddress[tokenInfo.address] = tokenInfo;
                    }
                    return [4 /*yield*/, connection.getTokenLargestAccounts(TEST_MINT_ID)];
                case 2:
                    largestTokenAccounts = _g.sent();
                    tokenAccountsByOwnerAddress = {};
                    tokenAmountByMintAddress = {};
                    _d = 0, _e = largestTokenAccounts.value;
                    _g.label = 3;
                case 3:
                    if (!(_d < _e.length)) return [3 /*break*/, 17];
                    largestTokenAccount = _e[_d];
                    return [4 /*yield*/, connection.getParsedAccountInfo(largestTokenAccount.address)];
                case 4:
                    largestTokenAccountInfo = _g.sent();
                    return [4 /*yield*/, (0, util_1.delay)(1000)];
                case 5:
                    _g.sent();
                    largestTokenAccountInfoData = (_a = largestTokenAccountInfo.value) === null || _a === void 0 ? void 0 : _a.data;
                    if (!largestTokenAccountInfoData)
                        return [3 /*break*/, 16];
                    tokenAccountOwnerPubKey = new Web3.PublicKey(largestTokenAccountInfoData.parsed.info.owner);
                    tokenAccountsPromiseTimeout = new Promise(function (res) { return setTimeout(function () { return res(undefined); }, 5000); });
                    tokenAccountsPromise = connection
                        .getParsedTokenAccountsByOwner(tokenAccountOwnerPubKey, { programId: ids_1.TOKEN_PROGRAM_ID });
                    return [4 /*yield*/, Promise.race([tokenAccountsPromise, tokenAccountsPromiseTimeout])];
                case 6:
                    results = _g.sent();
                    tokenAccounts = results === null || results === void 0 ? void 0 : results.value;
                    if (!tokenAccounts)
                        return [3 /*break*/, 16];
                    /// Skip market makers
                    if (tokenAccounts.length > 100)
                        return [3 /*break*/, 16];
                    _f = 0, tokenAccounts_1 = tokenAccounts;
                    _g.label = 7;
                case 7:
                    if (!(_f < tokenAccounts_1.length)) return [3 /*break*/, 16];
                    tokenAccount = tokenAccounts_1[_f];
                    tokenAccountPubKey = tokenAccount.pubkey;
                    parsedInfo = tokenAccount.account.data.parsed.info;
                    tokenMintPubKey = new Web3.PublicKey(parsedInfo.mint);
                    tokenInfo = tokenInfoByAddress[tokenMintPubKey.toBase58()];
                    if (!tokenInfo)
                        return [3 /*break*/, 15];
                    return [4 /*yield*/, (0, util_1.delay)(500)];
                case 8:
                    _g.sent();
                    return [4 /*yield*/, (0, AccountInfoService_1.fetchAccountInfo)(connection, tokenMintPubKey)];
                case 9:
                    tokenMintResult = _g.sent();
                    if (!tokenMintResult)
                        return [3 /*break*/, 15];
                    parsedTokenMintInfo = tokenMintResult.details.data.parsed.info;
                    tokenSupply = parsedTokenMintInfo.supply / Math.pow(10, parsedTokenMintInfo.decimals);
                    tokenAccountAmount = parsedInfo.tokenAmount.uiAmount;
                    tokenAccountAmountDistribution = tokenAccountAmount / tokenSupply;
                    if (
                    /// Filter out token accounts with amounts greater than 1%
                    /// Because those are market maker wallets
                    tokenAccountAmountDistribution > 0.01 ||
                        /// Filter out obscure tokens
                        !tokenInfo)
                        return [3 /*break*/, 15];
                    key = tokenInfo.name;
                    previousTokenAmount = tokenAmountByMintAddress[key] || 0.0;
                    totalTokenAmount = previousTokenAmount + tokenAccountAmount;
                    tokenAmountByMintAddress[key] = totalTokenAmount;
                    return [4 /*yield*/, AccountRepository.upsert({ address: tokenAccountPubKey.toBase58() })];
                case 10:
                    tokenAccountEntity = _g.sent();
                    return [4 /*yield*/, AccountRepository.upsert({ address: tokenMintPubKey.toBase58() })];
                case 11:
                    tokenMintAccountEntity = _g.sent();
                    return [4 /*yield*/, AccountRepository.upsert({ address: tokenAccountOwnerPubKey.toBase58() })];
                case 12:
                    tokenOwnerAccountEntity = _g.sent();
                    return [4 /*yield*/, TokenInfoRepository.upsert(tokenMintAccountEntity.address, tokenInfo.symbol, tokenInfo.decimals, tokenInfo.logoURI, (_b = tokenInfo.extensions) === null || _b === void 0 ? void 0 : _b.website, (_c = tokenInfo.extensions) === null || _c === void 0 ? void 0 : _c.coingeckoId)];
                case 13:
                    tokenInfoEntity = _g.sent();
                    return [4 /*yield*/, TokenAccountRepository.upsert({
                            tokenAccount: tokenAccountEntity,
                            tokenMintAccount: tokenMintAccountEntity,
                            tokenOwnerAccount: tokenOwnerAccountEntity,
                            balance: tokenAccountAmount
                        })];
                case 14:
                    result = _g.sent();
                    _g.label = 15;
                case 15:
                    _f++;
                    return [3 /*break*/, 7];
                case 16:
                    _d++;
                    return [3 /*break*/, 3];
                case 17: return [2 /*return*/];
            }
        });
    });
}
function testSolana2() {
    return __awaiter(this, void 0, void 0, function () {
        var connection, ABR_RAY_AMM, ABR_SRM_DEX, ABR_MINT_ID, TULIP_MINT_ID, TEST_ADDRESS, tokenBalanceByTokenAddress, concurrency, processIntervalSeconds, counts;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connection = new Web3.Connection(process.env.SOLANA_RPC || "", 
                    // Web3.clusterApiUrl("devnet"),
                    'confirmed');
                    ABR_RAY_AMM = (0, ids_1.toPublicKey)('3zrQ9od43vB9sV1MNbM68VnkLCfq9dVUvM1hmp8tcJNz');
                    ABR_SRM_DEX = (0, ids_1.toPublicKey)('FrR9FBmiBjm2GjLZbfnCcgkbueUJ78NbBx1qcQKPUQe8');
                    ABR_MINT_ID = (0, ids_1.toPublicKey)("a11bdAAuV8iB2fu7X6AxAvDTo1QZ8FXB3kk5eecdasp");
                    TULIP_MINT_ID = (0, ids_1.toPublicKey)("TuLipcqtGVXP9XR62wM8WWCm6a9vhLs7T1uoWBk6FDs");
                    TEST_ADDRESS = (0, ids_1.toPublicKey)("4JDhmLVobWpUaV8tr3ZGAXmSp3vMf24a2D2dVfoH1E5T");
                    tokenBalanceByTokenAddress = {};
                    concurrency = 1;
                    processIntervalSeconds = 3;
                    return [4 /*yield*/, QueueService_1.newTransactionQueue.checkHealth()];
                case 1:
                    counts = _a.sent();
                    // print all the job counts
                    console.log('job state counts:', counts);
                    return [4 /*yield*/, QueueService_1.newTransactionQueue.destroy()];
                case 2:
                    _a.sent();
                    QueueService_1.newTransactionQueue.process(concurrency, function (job) { return __awaiter(_this, void 0, void 0, function () {
                        var transaction, parsed;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    transaction = job.data;
                                    return [4 /*yield*/, connection.getParsedConfirmedTransaction(transaction.signature)];
                                case 1:
                                    parsed = _a.sent();
                                    console.log(parsed === null || parsed === void 0 ? void 0 : parsed.transaction.message.instructions);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    // const transactions = await TransactionToTokenAccountRepository.listTransactionsWithNoTokenAccounts(10)
                    // for (const transaction of transactions) {
                    //   await processTransactionForTokenBalance(connection, transaction)
                    // }
                    // await TransactionSnapshotService.performEntireTransactionSignaturesScrape(
                    //   connection,
                    //   ABR_RAY_AMM
                    // )
                    return [4 /*yield*/, TransactionSnapshotService.performEntireTransactionSignaturesScrape(connection, TEST_ADDRESS)
                        // await TransactionSnapshotService.performEntireTransactionSignaturesScrape(
                        //   connection,
                        //   ABR_SRM_DEX
                        // )
                    ];
                case 3:
                    // const transactions = await TransactionToTokenAccountRepository.listTransactionsWithNoTokenAccounts(10)
                    // for (const transaction of transactions) {
                    //   await processTransactionForTokenBalance(connection, transaction)
                    // }
                    // await TransactionSnapshotService.performEntireTransactionSignaturesScrape(
                    //   connection,
                    //   ABR_RAY_AMM
                    // )
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function processTransactionForTokenAccounts(connection, transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var loggerId, tokenAccounts, promises, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loggerId = (0, util_1.makeLoggerId)();
                    return [4 /*yield*/, TokenBalanceSnapshotService.getTokenAccountSnapshots(connection, transaction)];
                case 1:
                    tokenAccounts = _a.sent();
                    promises = tokenAccounts.map(function (tokenAccount) {
                        return TokenAccountRepository.upsert(tokenAccount);
                    });
                    return [4 /*yield*/, Promise.all(promises)];
                case 2:
                    results = _a.sent();
                    if (results.length == 0)
                        return [2 /*return*/, Promise.resolve()];
                    console.log(loggerId + ": TRANSACTION " + transaction.signature + " -- updated " + results.length + " token balances");
                    return [2 /*return*/, Promise.resolve()];
            }
        });
    });
}
function testSolana() {
    return __awaiter(this, void 0, void 0, function () {
        var connection, ABE_RAY_AMM, ABR_SRM_DEX, ABR_MINT_ID, TULIP_MINT_ID, SRM_PROGRAM_ID, url, wsURL, isTaskInProgress, ABR_MINT_ADDRESS, cron;
        var _this = this;
        return __generator(this, function (_a) {
            connection = new Web3.Connection(process.env.SOLANA_RPC || "", 
            // Web3.clusterApiUrl("devnet"),
            'confirmed');
            ABE_RAY_AMM = (0, ids_1.toPublicKey)('GQJjrG6f8HbxkE3ZVSRpzoyWhQ2RiivT68BybVK9DxME');
            ABR_SRM_DEX = (0, ids_1.toPublicKey)('FrR9FBmiBjm2GjLZbfnCcgkbueUJ78NbBx1qcQKPUQe8');
            ABR_MINT_ID = (0, ids_1.toPublicKey)("a11bdAAuV8iB2fu7X6AxAvDTo1QZ8FXB3kk5eecdasp");
            TULIP_MINT_ID = (0, ids_1.toPublicKey)("TuLipcqtGVXP9XR62wM8WWCm6a9vhLs7T1uoWBk6FDs");
            SRM_PROGRAM_ID = (0, ids_1.toPublicKey)("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin");
            url = 'http://192.168.1.88:8899';
            wsURL = 'ws://192.168.1.88:8900';
            isTaskInProgress = false;
            ABR_MINT_ADDRESS = ABR_MINT_ID.toBase58();
            cron = Cron.schedule('*/3 * * * * *', function () { return __awaiter(_this, void 0, void 0, function () {
                var loggerId, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            loggerId = (0, util_1.makeLoggerId)();
                            if (isTaskInProgress)
                                return [2 /*return*/];
                            isTaskInProgress = true;
                            return [4 /*yield*/, TokenSnapshotService.takeSnapshot(connection, ABR_MINT_ADDRESS, ABR_SRM_DEX.toBase58())];
                        case 1:
                            result = _a.sent();
                            console.log(result);
                            isTaskInProgress = false;
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
function displayTimestamp(unixTimestamp, shortTimeZoneName) {
    if (shortTimeZoneName === void 0) { shortTimeZoneName = false; }
    var expireDate = new Date(unixTimestamp);
    var dateString = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(expireDate);
    var timeString = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hourCycle: "h23",
        timeZoneName: shortTimeZoneName ? "short" : "long",
    }).format(expireDate);
    return dateString + " at " + timeString;
}
exports.displayTimestamp = displayTimestamp;
function displayTimestampUtc(unixTimestamp, shortTimeZoneName) {
    if (shortTimeZoneName === void 0) { shortTimeZoneName = false; }
    var expireDate = new Date(unixTimestamp);
    var dateString = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    }).format(expireDate);
    var timeString = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hourCycle: "h23",
        timeZone: "UTC",
        timeZoneName: shortTimeZoneName ? "short" : "long",
    }).format(expireDate);
    return dateString + " at " + timeString;
}
exports.displayTimestampUtc = displayTimestampUtc;
function displayTimestampWithoutDate(unixTimestamp, shortTimeZoneName) {
    if (shortTimeZoneName === void 0) { shortTimeZoneName = true; }
    var expireDate = new Date(unixTimestamp);
    var timeString = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hourCycle: "h23",
        timeZoneName: shortTimeZoneName ? "short" : "long",
    }).format(expireDate);
    return timeString;
}
exports.displayTimestampWithoutDate = displayTimestampWithoutDate;
