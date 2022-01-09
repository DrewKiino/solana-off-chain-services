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
exports.CronTask = void 0;
var typeorm_1 = require("typeorm");
var CronTask = /** @class */ (function () {
    function CronTask() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], CronTask.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "cron_expression", type: "varchar", length: 12, nullable: false, unique: true }),
        __metadata("design:type", String)
    ], CronTask.prototype, "cronExpression", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "task_identifier", type: "varchar", length: 200, nullable: false }),
        __metadata("design:type", String)
    ], CronTask.prototype, "taskIdentifier", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: function () { return "CURRENT_TIMESTAMP(6)"; } }),
        __metadata("design:type", Date)
    ], CronTask.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: function () { return "CURRENT_TIMESTAMP(6)"; }, onUpdate: "CURRENT_TIMESTAMP(6)" }),
        __metadata("design:type", Date)
    ], CronTask.prototype, "updatedAt", void 0);
    CronTask = __decorate([
        (0, typeorm_1.Entity)({ name: "cron_tasks" })
    ], CronTask);
    return CronTask;
}());
exports.CronTask = CronTask;
