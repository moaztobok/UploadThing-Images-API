"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const app_1 = require("./config/app");
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
(0, app_1.run)();
const PORT = process.env.PORT;
const gallery_1 = __importDefault(require("./routes/gallery"));
exports.app.use('/', (req, res) => {
    res.send('Hello World');
});
exports.app.use('/api/gallery/', gallery_1.default);
exports.app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
