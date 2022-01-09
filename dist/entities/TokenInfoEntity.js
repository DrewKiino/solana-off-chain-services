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
exports.TokenInfoEntity = void 0;
var typeorm_1 = require("typeorm");
var AccountEntity_1 = require("./AccountEntity");
var TokenInfoEntity = /** @class */ (function () {
    function TokenInfoEntity() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], TokenInfoEntity.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function (type) { return AccountEntity_1.AccountEntity; }),
        (0, typeorm_1.JoinColumn)({ name: "token_mint_account_id" }),
        __metadata("design:type", AccountEntity_1.AccountEntity)
    ], TokenInfoEntity.prototype, "tokenMintAccount", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "symbol", type: "varchar", length: 64, nullable: false }),
        __metadata("design:type", String)
    ], TokenInfoEntity.prototype, "symbol", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "decimals", type: "tinyint", nullable: false }),
        __metadata("design:type", Number)
    ], TokenInfoEntity.prototype, "decimals", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "logo_uri", type: "varchar", length: 256, nullable: true }),
        __metadata("design:type", Object)
    ], TokenInfoEntity.prototype, "logoUri", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "website", type: "varchar", length: 256, nullable: true }),
        __metadata("design:type", Object)
    ], TokenInfoEntity.prototype, "website", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "coingecko_id", type: "varchar", length: 64, nullable: true }),
        __metadata("design:type", Object)
    ], TokenInfoEntity.prototype, "coingeckoId", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ name: "created_at", type: "timestamp", default: function () { return "CURRENT_TIMESTAMP(6)"; } }),
        __metadata("design:type", Date)
    ], TokenInfoEntity.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ name: "updated_at", type: "timestamp", default: function () { return "CURRENT_TIMESTAMP(6)"; }, onUpdate: "CURRENT_TIMESTAMP(6)" }),
        __metadata("design:type", Date)
    ], TokenInfoEntity.prototype, "updatedAt", void 0);
    TokenInfoEntity = __decorate([
        (0, typeorm_1.Entity)({ name: "token_infos" })
    ], TokenInfoEntity);
    return TokenInfoEntity;
}());
exports.TokenInfoEntity = TokenInfoEntity;
