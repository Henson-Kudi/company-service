import * as amqplib from "amqplib";
import envConf from "./env.conf";
import logger from "../../../utils/logging/winstonLogger";

export default class RabbitMq {
    private _connection: amqplib.Connection | undefined

    public async getConnection(): Promise<amqplib.Connection> {

        if (this._connection) {
            logger.info('Rabbit MQ already connected')
            return this._connection
        }

        this._connection = await amqplib.connect(envConf.uri, envConf.options)

        logger.info('Rabbit Mq connected successfully')

        return this._connection
    }

    public async connect(): Promise<amqplib.Connection> {
        this._connection = await amqplib.connect(envConf.uri, envConf.options)

        logger.info('Rabbit Mq connected successfully')

        return this._connection
    }

    public async closeConnection() {
        if (this._connection) {
            await this._connection.close()
            this._connection = undefined

            logger.info('Rabbit MQ connection closed successfully.')

            return
        }
    }
}

export function listenForConnectionFailures(connection: amqplib.Connection) {
    connection.on('error', (err) => {
        logger.error('Failed to connected to rabbitMq server', { file: __filename })
        logger.error(err)
    })

    connection.on('close', () => {
        logger.info('Rabbit MQ connection closed successfully')
    })
}