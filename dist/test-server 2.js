"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3001;
app.get('/test', (req, res) => {
    res.json({ message: 'Test server is running!' });
});
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Test server is running on http://127.0.0.1:${PORT}`);
});
//# sourceMappingURL=test-server.js.map