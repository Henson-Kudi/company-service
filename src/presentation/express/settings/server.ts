import { Server } from "http";
import IRabbitMQProvider from "../../../application/providers/RabbitMq.provider";
import initialiseApp from "./app";
import envConf from "../../../infrastructure/config/env.conf";
import logger from "../../../infrastructure/utils/logging/winstonLogger";

export default function startServer(rabbitMQProvider: IRabbitMQProvider): Server {
    const app = initialiseApp(rabbitMQProvider)

    const server = app.listen(envConf.serverPort, () => logger.info(`Server running on: http://localhost:${envConf.serverPort}`))

    return server
}