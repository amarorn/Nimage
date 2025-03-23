"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class Database {
    static connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
                this.client = new mongodb_1.MongoClient(uri);
                yield this.client.connect();
            }
        });
    }
    static getCollection(name) {
        if (!this.collections.has(name)) {
            const db = this.client.db(process.env.DB_NAME || 'nimage');
            this.collections.set(name, db.collection(name));
        }
        return this.collections.get(name);
    }
    static disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client) {
                yield this.client.close();
                this.client = null;
                this.collections.clear();
            }
        });
    }
}
exports.Database = Database;
Database.collections = new Map();
