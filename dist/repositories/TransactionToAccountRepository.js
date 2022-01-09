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
exports.findEarliestByAddress = exports.findLatestByAddress = exports.listTransactionsByAddress = exports.findOneTransactionByTransactionSignatureAndAccountId = exports.findOneByTransactionIdAndAccountId = exports.upsert = void 0;
var TransactionEntity_1 = require("../entities/TransactionEntity");
var SqlService = __importStar(require("../services/SqlService"));
var TransactionToAccountEntity_1 = require("../entities/TransactionToAccountEntity");
var AccountEntity_1 = require("../entities/AccountEntity");
var upsert = function (accountId, transactionId) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, repository, cache, entity;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, SqlService.connection()];
                case 1:
                    connection = _a.sent();
                    repository = connection.getRepository(TransactionToAccountEntity_1.TransactionToAccountEntity);
                    return [4 /*yield*/, (0, exports.findOneByTransactionIdAndAccountId)(accountId, transactionId)];
                case 2:
                    cache = _a.sent();
                    if (cache)
                        return [2 /*return*/, Promise.resolve(cache)];
                    entity = new TransactionToAccountEntity_1.TransactionToAccountEntity();
                    entity.account = { id: accountId };
                    entity.transaction = { id: transactionId };
                    return [4 /*yield*/, repository.save(entity)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, entity];
            }
        });
    });
};
exports.upsert = upsert;
var findOneByTransactionIdAndAccountId = function (accountId, transactionId) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, repository;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, SqlService.connection()];
                case 1:
                    connection = _a.sent();
                    repository = connection.getRepository(TransactionToAccountEntity_1.TransactionToAccountEntity);
                    return [4 /*yield*/, repository
                            .createQueryBuilder('toa')
                            .where("toa.account_id = " + accountId)
                            .where("toa.transaction_id = " + transactionId)
                            .limit(1)
                            .getOne()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.findOneByTransactionIdAndAccountId = findOneByTransactionIdAndAccountId;
var findOneTransactionByTransactionSignatureAndAccountId = function (transactionSignature, accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, repository;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, SqlService.connection()];
                case 1:
                    connection = _a.sent();
                    repository = connection.getRepository(TransactionEntity_1.TransactionEntity);
                    return [4 /*yield*/, repository
                            .createQueryBuilder('t')
                            .innerJoin(TransactionToAccountEntity_1.TransactionToAccountEntity, 'toa', 'toa.transaction_id = t.id')
                            .innerJoin(AccountEntity_1.AccountEntity, 'a', 'a.id = toa.account_id')
                            .where("toa.account_id = " + accountId)
                            .where("t.signature = '" + transactionSignature + "'")
                            .limit(1)
                            .getOne()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.findOneTransactionByTransactionSignatureAndAccountId = findOneTransactionByTransactionSignatureAndAccountId;
var listTransactionsByAddress = function (address, limit, offset) {
    if (offset === void 0) { offset = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var connection, repository;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, SqlService.connection()];
                case 1:
                    connection = _a.sent();
                    repository = connection.getRepository(TransactionEntity_1.TransactionEntity);
                    return [4 /*yield*/, repository.createQueryBuilder('t')
                            .innerJoin(TransactionToAccountEntity_1.TransactionToAccountEntity, 'toa', 'toa.transaction_id = t.id')
                            .innerJoin(AccountEntity_1.AccountEntity, 'a', 'a.id = toa.account_id')
                            .where("a.address = '" + address + "'")
                            .orderBy('t.block_time', 'DESC')
                            .limit(limit)
                            .offset(offset)
                            .getMany()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.listTransactionsByAddress = listTransactionsByAddress;
var findLatestByAddress = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, repository;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, SqlService.connection()];
                case 1:
                    connection = _a.sent();
                    repository = connection.getRepository(TransactionEntity_1.TransactionEntity);
                    return [4 /*yield*/, repository.createQueryBuilder('t')
                            .innerJoin(TransactionToAccountEntity_1.TransactionToAccountEntity, 'toa', 'toa.transaction_id = t.id')
                            .innerJoin(AccountEntity_1.AccountEntity, 'a', 'a.id = toa.account_id')
                            .where("a.address = '" + address + "'")
                            .orderBy('t.block_time', 'DESC')
                            .limit()
                            .getOne()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.findLatestByAddress = findLatestByAddress;
var findEarliestByAddress = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, repository;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, SqlService.connection()];
                case 1:
                    connection = _a.sent();
                    repository = connection.getRepository(TransactionEntity_1.TransactionEntity);
                    return [4 /*yield*/, repository.createQueryBuilder('t')
                            .innerJoin(TransactionToAccountEntity_1.TransactionToAccountEntity, 'toa', 'toa.transaction_id = t.id')
                            .innerJoin(AccountEntity_1.AccountEntity, 'a', 'a.id = toa.account_id')
                            .where("a.address = '" + address + "'")
                            .orderBy('t.block_time', 'ASC')
                            .limit(1)
                            .getOne()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.findEarliestByAddress = findEarliestByAddress;
