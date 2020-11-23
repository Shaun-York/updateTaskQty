const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
const sqs = new AWS.SQS({
    apiVersion: '2012-11-05'
});
const update_task_qty = require('./src/update_task_qty')

function sendToNextSqs(message, receiptHandle) {
    return new Promise((resolve, reject) => {
        sqs.sendMessage(message, function (error, data) {
            if (error) {
                console.info(error, error.stack); // an error occurred
                reject(error.message)
            } else {
                console.log('SQS message send:', data)

                const delmessage = {
                    QueueUrl: process.env.OUTPUT_QUEUE,
                    ReceiptHandle: receiptHandle
                }

                sqs.deleteMessage(delmessage, function (error, data) {
                    if (error) {
                        console.log(error, error.stack)
                        throw new Error('Failed to delete message')
                    } else {
                        console.log('SQS message deleted', data); // successful response
                    }
                })
                resolve(data)
            }
        })
    })
}

exports.handler = async (event) => {
    for (const {
            messageId,
            body,
            receiptHandle
        } of event.Records) {
        try {

            const msg = JSON.parse(body)
            const payload = (msg.event.data.new !== null) ? msg.event.data.new : msg.event.data.old
            const message = {
                MessageBody: JSON.stringify(payload),
                QueueUrl: process.env.INPUT_QUEUE
            }

            const response = await update_task_qty(payload, 0)

            if (response.succes) {
                console.info('Sending ', messageId)
                await sendToNextSqs(message, receiptHandle)
            } else {
                throw new Error('Could not update qty...')
            }

        } catch (error) {
            console.info(error.message)
            throw new Error(error.message)
        }
    }
    return `Successfully processed ${event.Records.length} messages.`;
};
