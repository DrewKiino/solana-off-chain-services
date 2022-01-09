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
exports.getTokenAccountSnapshots = void 0;
var AccountRepository = __importStar(require("../repositories/AccountRepository"));
var util_1 = require("../util/util");
var crypto_1 = require("crypto");
function getTokenAccountSnapshots(connection, transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, connection.getParsedConfirmedTransaction(transaction.signature)];
                case 1:
                    result = _a.sent();
                    if (!result)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, parseTokenAccounts(connection, transaction, result)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getTokenAccountSnapshots = getTokenAccountSnapshots;
function parseTokenAccounts(connection, transaction, parsedConfirmedTransaction) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var accountKeys, meta, tokenAccountByPubKey, postTokenBalances, accountKeyPromises, addresses, accountEntities, accountEntityByAddress, _i, accountEntities_1, accountEntity, promises, _b, postTokenBalances_1, postTokenBalance, account, results, _c, results_1, result, resultWithRef, parsedInfo, accountAddress, mintAddress, ownerAddress, tokenAccount, tokenMintAccount, tokenOwnerAccount, tokenAmount;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    accountKeys = parsedConfirmedTransaction.transaction.message.accountKeys;
                    meta = parsedConfirmedTransaction.meta;
                    tokenAccountByPubKey = {};
                    if (!meta)
                        return [2 /*return*/, []];
                    postTokenBalances = meta.postTokenBalances;
                    if (!postTokenBalances)
                        return [2 /*return*/, []];
                    accountKeyPromises = [];
                    addresses = new Set();
                    accountKeys.forEach(function (accountKey) { return addresses.add(accountKey.pubkey.toBase58()); });
                    postTokenBalances.forEach(function (postTokenBalance) { return addresses.add(postTokenBalance.mint); });
                    addresses.forEach(function (address) {
                        return accountKeyPromises.push(AccountRepository.upsert({ address: address }));
                    });
                    return [4 /*yield*/, Promise.all(accountKeyPromises)];
                case 1:
                    accountEntities = _d.sent();
                    accountEntityByAddress = {};
                    for (_i = 0, accountEntities_1 = accountEntities; _i < accountEntities_1.length; _i++) {
                        accountEntity = accountEntities_1[_i];
                        accountEntityByAddress[accountEntity.address] = accountEntity;
                    }
                    promises = [];
                    for (_b = 0, postTokenBalances_1 = postTokenBalances; _b < postTokenBalances_1.length; _b++) {
                        postTokenBalance = postTokenBalances_1[_b];
                        account = accountKeys[postTokenBalance.accountIndex].pubkey;
                        promises.push(getParsedAccountInfoWithAccountRef(connection, account));
                    }
                    return [4 /*yield*/, Promise.all(promises)];
                case 2:
                    results = _d.sent();
                    for (_c = 0, results_1 = results; _c < results_1.length; _c++) {
                        result = results_1[_c];
                        if (!result)
                            continue;
                        resultWithRef = result;
                        parsedInfo = (_a = resultWithRef.parsedAccountData.parsed) === null || _a === void 0 ? void 0 : _a.info;
                        accountAddress = resultWithRef.account.toBase58();
                        if (!parsedInfo)
                            continue;
                        mintAddress = parsedInfo.mint;
                        ownerAddress = parsedInfo.owner;
                        tokenAccount = accountEntityByAddress[accountAddress];
                        tokenMintAccount = accountEntityByAddress[mintAddress];
                        tokenOwnerAccount = accountEntityByAddress[ownerAddress];
                        tokenAmount = parsedInfo.tokenAmount.uiAmount;
                        if (!tokenAccount)
                            continue;
                        if (!tokenMintAccount)
                            continue;
                        if (!tokenOwnerAccount)
                            continue;
                        tokenAccountByPubKey[accountAddress] = {
                            tokenAccount: tokenAccount,
                            tokenMintAccount: tokenMintAccount,
                            tokenOwnerAccount: tokenOwnerAccount,
                            balance: tokenAmount
                        };
                    }
                    return [2 /*return*/, Object.values(tokenAccountByPubKey)];
            }
        });
    });
}
function getParsedAccountInfoWithAccountRef(connection, account) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var result, data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, util_1.delay)((0, crypto_1.randomInt)(1, 30) * 100)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, connection.getParsedAccountInfo(account)];
                case 2:
                    result = _b.sent();
                    data = (_a = result.value) === null || _a === void 0 ? void 0 : _a.data;
                    if (!data)
                        return [2 /*return*/, undefined];
                    return [2 /*return*/, {
                            account: account,
                            parsedAccountData: data
                        }];
            }
        });
    });
}
