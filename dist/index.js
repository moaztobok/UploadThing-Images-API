"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./config/app");
(0, app_1.run)();
const PORT = process.env.PORT;
const gallery_1 = __importDefault(require("./routes/gallery"));
app_1.app.use('/', (req, res) => {
    res.send('Hello World');
});
app_1.app.use('/api/gallery', gallery_1.default);
app_1.app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
