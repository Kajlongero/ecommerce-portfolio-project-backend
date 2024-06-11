const { Server } = require("socket.io");
const { createServer } = require("http");
const { serverConfigs } = require("./configs/server.configs");
const {
  BoomErrorHandler,
  TypeErrorHandler,
  ServerErrorHandler,
} = require("./middlewares/errors.handler");
const express = require("express");
const cors = require("cors");
const app = express();
const apiRouting = require("./components/route");

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    origin: "*",
  },
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

apiRouting(app);

app.use(TypeErrorHandler);
app.use(BoomErrorHandler);
app.use(ServerErrorHandler);

io.on("connection", (socket) => {});

httpServer.listen(serverConfigs.PORT || 3000, () => {
  console.log("Server running at port", serverConfigs.PORT);
});
