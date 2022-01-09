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
exports.TokenSnapshot = void 0;
var typeorm_1 = require("typeorm");
var TokenSnapshot = /** @class */ (function () {
    function TokenSnapshot() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], TokenSnapshot.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "public_key", type: "varchar", length: 64, nullable: false }),
        __metadata("design:type", String)
    ], TokenSnapshot.prototype, "publicKey", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "decimals", type: "int", nullable: false }),
        __metadata("design:type", Number)
    ], TokenSnapshot.prototype, "decimals", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "price", type: "decimal", precision: 36, scale: 18, nullable: false }),
        __metadata("design:type", Number)
    ], TokenSnapshot.prototype, "price", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "supply", type: "decimal", precision: 36, scale: 18, nullable: false }),
        __metadata("design:type", Number)
    ], TokenSnapshot.prototype, "supply", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "market_cap", type: "decimal", precision: 36, scale: 18, nullable: false }),
        __metadata("design:type", Number)
    ], TokenSnapshot.prototype, "marketCap", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: function () { return "CURRENT_TIMESTAMP(6)"; } }),
        __metadata("design:type", Date)
    ], TokenSnapshot.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: function () { return "CURRENT_TIMESTAMP(6)"; }, onUpdate: "CURRENT_TIMESTAMP(6)" }),
        __metadata("design:type", Date)
    ], TokenSnapshot.prototype, "updatedAt", void 0);
    TokenSnapshot = __decorate([
        (0, typeorm_1.Entity)({ name: "token_snapshots" })
    ], TokenSnapshot);
    return TokenSnapshot;
}());
exports.TokenSnapshot = TokenSnapshot;
