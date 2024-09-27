"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const db_connect_1 = require("./external/data-sources/mongodb/db-connect");
const routers_1 = require("./external/api/routers");
const port = 8001;
(0, db_connect_1.connectToDataBase)()
    .then(() => {
    server_1.default.listen(port, () => {
        server_1.default.use('/', routers_1.routes);
        console.log(`Server is listening on port: ${port}`);
    });
})
    .catch((error) => {
    console.error("Database connection failed", error);
    process.exit();
});
