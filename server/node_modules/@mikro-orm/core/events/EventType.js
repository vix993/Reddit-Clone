"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = void 0;
var EventType;
(function (EventType) {
    EventType["onInit"] = "onInit";
    EventType["beforeCreate"] = "beforeCreate";
    EventType["afterCreate"] = "afterCreate";
    EventType["beforeUpdate"] = "beforeUpdate";
    EventType["afterUpdate"] = "afterUpdate";
    EventType["beforeDelete"] = "beforeDelete";
    EventType["afterDelete"] = "afterDelete";
    EventType["beforeFlush"] = "beforeFlush";
    EventType["onFlush"] = "onFlush";
    EventType["afterFlush"] = "afterFlush";
})(EventType = exports.EventType || (exports.EventType = {}));
