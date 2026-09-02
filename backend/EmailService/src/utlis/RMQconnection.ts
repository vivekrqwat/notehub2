import amqp, { ChannelModel, Channel } from 'amqplib';

interface RmqInstance {
  connection: ChannelModel;
  channel: Channel;
}
const rabbitmqUrl = process.env.RABBITMQ_URL;
if (!rabbitmqUrl) {
  console.warn('Warning: RABBITMQ_URL is not defined. Falling back to local instance.');
}

const RmqUri = rabbitmqUrl || 'amqp://localhost';
 const RmqConnection=async():Promise<RmqInstance>=>{
    try{
        if(!RmqUri){
            throw new Error('RabbitMQ URL is not defined in environment variables.');
        }
        const connection=await amqp.connect(RmqUri);
        const channel = await connection.createChannel();
          process.on('SIGINT', async () => {
      await channel.close();
      await connection.close();
      process.exit(0);
    });
            return { connection, channel } ;
    }catch(e){
        console.error('RabbitMQ connection error:', e);
        throw e;
    }

}
export default RmqConnection;