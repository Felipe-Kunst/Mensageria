const amqp = require('amqplib');
const dotenv = require('dotenv').config();

async function sendMessage(valorRetirado) {
    let queue = 'hello';
    let url = process.env.AMQP;
    try {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: false });
        await channel.sendToQueue(queue, Buffer.from(valorRetirado.toString()));
        console.log(`Mensagem enviada: ${valorRetirado}`);
        setTimeout(() => {
            connection.close();
            process.exit();
        }, 500);
    } catch (error) {
        console.error(error);
    }
}
const valorRetirado = process.argv[2] ? parseFloat(process.argv[2]) : 100;
sendMessage(valorRetirado);
