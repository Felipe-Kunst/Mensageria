const amqp = require('amqplib');
const dotenv = require('dotenv').config();

let url = process.env.AMQP;
let quantiaInicial = 1000; 

async function receiveMessage() {
    let queue = 'hello';
    try {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: false });
        console.log(`Aguardando mensagens na fila: ${queue}`);
        console.log(`Quantia inicial: ${quantiaInicial}`);
        channel.consume(queue, (msg) => {
            const valorRetirado = parseFloat(msg.content.toString());

            if (valorRetirado <= quantiaInicial) {
                quantiaInicial -= valorRetirado;
                console.log(`Valor Retirado: ${valorRetirado}. Quantia atual: ${quantiaInicial}`);
            } else {
                console.log(`Valor Retirado: ${valorRetirado}. Saldo insuficiente. Quantia atual: ${quantiaInicial}`);
            }
        }, { noAck: true });

    } catch (error) {
        console.error(error);
    }
}

receiveMessage();
