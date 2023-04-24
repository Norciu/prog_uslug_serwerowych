import * as amqplib from 'amqplib';
import config from './config';

export default function RabbitMq() {
  //@ts-ignore
  amqplib.connect(config.rabbitmq_url, (err, conn) => {
    conn.close();
    if (err) {
      throw new Error(err);
    }
    conn.close();
  });

  return amqplib.connect(config.rabbitmq_url);
}
