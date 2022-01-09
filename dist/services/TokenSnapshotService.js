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
exports.list = exports.listByAccountAddress = exports.findMostRecentSnapshot = exports.insert = exports.takeSnapshot = void 0;
var SqlService = __importStar(require("./SqlService"));
var TokenSnapshotEntity_1 = require("../entities/TokenSnapshotEntity");
var ids_1 = require("../constants/ids");
var AccountInfoService_1 = require("./AccountInfoService");
var SerumMarketService_1 = require("./SerumMarketService");
var AccountEntity_1 = require("../entities/AccountEntity");
var AccountRepository = __importStar(require("../repositories/AccountRepository"));
var takeSnapshot = function (connection, tokenAddress, marketAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var publicKey, tokenAccount, market, bids, asks, bid, ask, price, result, info, decimals, supply, marketCap, mostRecentSnapshot, snapshot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("taking snapshot tokenAddress: " + tokenAddress + " marketAddress: " + marketAddress);
                    publicKey = (0, ids_1.toPublicKey)(tokenAddress);
                    return [4 /*yield*/, AccountRepository.upsert({ address: tokenAddress })];
                case 1:
                    tokenAccount = _a.sent();
                    return [4 /*yield*/, (0, SerumMarketService_1.findByMarketAddress)(connection, marketAddress)
                        // Fetching order books
                    ];
                case 2:
                    market = _a.sent();
                    return [4 /*yield*/, market.loadBids(connection)];
                case 3:
                    bids = _a.sent();
                    return [4 /*yield*/, market.loadAsks(connection)];
                case 4:
                    asks = _a.sent();
                    bid = bids.getL2(1)[0][0];
                    ask = asks.getL2(1)[0][0];
                    price = Math.floor((bid + ask) / 2 * 100) / 100;
                    return [4 /*yield*/, (0, AccountInfoService_1.fetchAccountInfo)(connection, publicKey)];
                case 5:
                    result = _a.sent();
                    info = result.details.data.parsed.info;
                    decimals = info.decimals;
                    supply = info.supply / Math.pow(10, decimals);
                    marketCap = price * supply;
                    console.log("publicKey: " + publicKey + " price: " + price + ", circulating_supply: " + supply + ", market_cap: " + marketCap);
                    return [4 /*yield*/, (0, exports.findMostRecentSnapshot)()];
                case 6:
                    mostRecentSnapshot = _a.sent();
                    if (mostRecentSnapshot) {
                        if (mostRecentSnapshot.price == price &&
                            mostRecentSnapshot.supply == supply &&
                            mostRecentSnapshot.marketCap == marketCap) {
                            console.log('skipping snapshot, no new data.');
                            return [2 /*return*/, mostRecentSnapshot];
                        }
                    }
                    return [4 /*yield*/, (0, exports.insert)({
                            tokenAccountId: tokenAccount.id,
                            decimals: decimals,
                            price: price,
                            supply: supply,
                            marketCap: marketCap
                        })];
                case 7:
                    snapshot = _a.sent();
                    console.log("created new snapshot " + snapshot.id);
                    return [2 /*return*/, Promise.resolve(snapshot)];
            }
        });
    });
};
exports.takeSnapshot = takeSnapshot;
var insert = function (newSnapshot) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, repository, snapshot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, SqlService.connection()];
                case 1:
                    connection = _a.sent();
                    repository = connection.getRepository(TokenSnapshotEntity_1.TokenSnapshotEntity);
                    snapshot = new TokenSnapshotEntity_1.TokenSnapshotEntity();
                    snapshot.tokenAccount = { id: newSnapshot.tokenAccountId };
                    snapshot.decimals = newSnapshot.decimals;
                    snapshot.price = newSnapshot.price;
                    snapshot.supply = newSnapshot.supply;
                    snapshot.marketCap = newSnapshot.marketCap;
                    return [4 /*yield*/, repository.save(snapshot)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, snapshot];
            }
        });
    });
};
exports.insert = insert;
var findMostRecentSnapshot = function () {
    return __awaiter(this, void 0, void 0, function () {
        var connection, repository;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, SqlService.connection()];
                case 1:
                    connection = _a.sent();
                    repository = connection.getRepository(TokenSnapshotEntity_1.TokenSnapshotEntity);
                    return [4 /*yield*/, repository.createQueryBuilder()
                            .orderBy('created_at', 'DESC')
                            .limit(1)
                            .getOne()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.findMostRecentSnapshot = findMostRecentSnapshot;
var listByAccountAddress = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, repository, now, sevenDay;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, SqlService.connection()];
                case 1:
                    connection = _a.sent();
                    repository = connection.getRepository(TokenSnapshotEntity_1.TokenSnapshotEntity);
                    now = new Date();
                    sevenDay = new Date(now.setDate(now.getDate() - 7)).toISOString();
                    return [2 /*return*/, repository.createQueryBuilder('ts')
                            .innerJoin(AccountEntity_1.AccountEntity, 'a', 'a.id = ts.token_account_id')
                            .where("ts.created_at >= '" + sevenDay + "'")
                            .limit(100)
                            .orderBy('ts.created_at', 'DESC')
                            .getMany()];
            }
        });
    });
};
exports.listByAccountAddress = listByAccountAddress;
var list = function () {
    return __awaiter(this, void 0, void 0, function () {
        var connection, repository;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, SqlService.connection()];
                case 1:
                    connection = _a.sent();
                    repository = connection.getRepository(TokenSnapshotEntity_1.TokenSnapshotEntity);
                    return [4 /*yield*/, repository.find()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.list = list;
