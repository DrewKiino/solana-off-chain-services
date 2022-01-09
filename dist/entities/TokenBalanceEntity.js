"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBalanceEntity = void 0;
var typeorm_1 = require("typeorm");
var TransactionEntity_1 = require("./TransactionEntity");
var TokenBalanceEntity = /** @class */ (function () {
    function TokenBalanceEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], TokenBalanceEntity.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function (type) { return TransactionEntity_1.TransactionEntity; }),
        (0, typeorm_1.JoinColumn)({ name: "transaction_id" }),
        __metadata("design:type", TransactionEntity_1.TransactionEntity)
    ], TokenBalanceEntity.prototype, "transaction", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "token_account_address", type: "varchar", length: 128, nullable: false }),
        __metadata("design:type", String)
    ], TokenBalanceEntity.prototype, "tokenAccountAddress", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "token_mint_address", type: "varchar", length: 128, nullable: false }),
        __metadata("design:type", String)
    ], TokenBalanceEntity.prototype, "tokenMintAddress", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "pre_balance", type: "decimal", precision: 36, scale: 18, nullable: false }),
        __metadata("design:type", Number)
    ], TokenBalanceEntity.prototype, "preBalance", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "post_balance", type: "decimal", precision: 36, scale: 18, nullable: false }),
        __metadata("design:type", Number)
    ], TokenBalanceEntity.prototype, "postBalance", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "change_balance", type: "decimal", precision: 36, scale: 18, nullable: false }),
        __metadata("design:type", Number)
    ], TokenBalanceEntity.prototype, "changeBalance", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "block_time", type: "int" }),
        __metadata("design:type", Number)
    ], TokenBalanceEntity.prototype, "blockTime", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: function () { return "CURRENT_TIMESTAMP(6)"; } }),
        __metadata("design:type", Date)
    ], TokenBalanceEntity.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: function () { return "CURRENT_TIMESTAMP(6)"; }, onUpdate: "CURRENT_TIMESTAMP(6)" }),
        __metadata("design:type", Date)
    ], TokenBalanceEntity.prototype, "updatedAt", void 0);
    TokenBalanceEntity = __decorate([
        (0, typeorm_1.Entity)({ name: "token_balances" })
    ], TokenBalanceEntity);
    return TokenBalanceEntity;
}());
exports.TokenBalanceEntity = TokenBalanceEntity;
