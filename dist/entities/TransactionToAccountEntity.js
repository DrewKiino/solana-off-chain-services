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
exports.TransactionToAccountEntity = void 0;
var typeorm_1 = require("typeorm");
var AccountEntity_1 = require("./AccountEntity");
var TransactionEntity_1 = require("./TransactionEntity");
var TransactionToAccountEntity = /** @class */ (function () {
    function TransactionToAccountEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], TransactionToAccountEntity.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function (type) { return AccountEntity_1.AccountEntity; }),
        (0, typeorm_1.JoinColumn)({ name: "account_id" }),
        __metadata("design:type", AccountEntity_1.AccountEntity)
    ], TransactionToAccountEntity.prototype, "account", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function (type) { return TransactionEntity_1.TransactionEntity; }),
        (0, typeorm_1.JoinColumn)({ name: "transaction_id" }),
        __metadata("design:type", TransactionEntity_1.TransactionEntity)
    ], TransactionToAccountEntity.prototype, "transaction", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp", default: function () { return "CURRENT_TIMESTAMP(6)"; } }),
        __metadata("design:type", Date)
    ], TransactionToAccountEntity.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: "updated_at", type: "timestamp", default: function () { return "CURRENT_TIMESTAMP(6)"; }, onUpdate: "CURRENT_TIMESTAMP(6)" }),
        __metadata("design:type", Date)
    ], TransactionToAccountEntity.prototype, "updatedAt", void 0);
    TransactionToAccountEntity = __decorate([
        (0, typeorm_1.Entity)({ name: "transactions_to_accounts" })
    ], TransactionToAccountEntity);
    return TransactionToAccountEntity;
}());
exports.TransactionToAccountEntity = TransactionToAccountEntity;
