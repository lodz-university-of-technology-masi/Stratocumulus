var uuid = require('node-uuid');

const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({
    region: "us-east-1"
});

exports.handler = async (event) => {
    const params = {
        TableName: "Tests",
        Item: JSON.parse(event.body)
    };

    params.Item.Id = uuid.v1();

    return await db.put(params).promise();
};
