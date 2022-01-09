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
exports.TransactionEntity = void 0;
var typeorm_1 = require("typeorm");
var TransactionEntity = /** @class */ (function () {
    function TransactionEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], TransactionEntity.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "signature", type: "varchar", length: 128, nullable: false, unique: true }),
        __metadata("design:type", String)
    ], TransactionEntity.prototype, "signature", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "slot", type: "int", nullable: true }),
        __metadata("design:type", Number)
    ], TransactionEntity.prototype, "slot", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "block_time", type: "int", nullable: true }),
        __metadata("design:type", Object)
    ], TransactionEntity.prototype, "blockTime", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "memo", type: "varchar", length: 32, nullable: true }),
        __metadata("design:type", Object)
    ], TransactionEntity.prototype, "memo", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp", default: function () { return "CURRENT_TIMESTAMP(6)"; } }),
        __metadata("design:type", Date)
    ], TransactionEntity.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: "updated_at", type: "timestamp", default: function () { return "CURRENT_TIMESTAMP(6)"; }, onUpdate: "CURRENT_TIMESTAMP(6)" }),
        __metadata("design:type", Date)
    ], TransactionEntity.prototype, "updatedAt", void 0);
    TransactionEntity = __decorate([
        (0, typeorm_1.Entity)({ name: "transactions" })
    ], TransactionEntity);
    return TransactionEntity;
}());
exports.TransactionEntity = TransactionEntity;
