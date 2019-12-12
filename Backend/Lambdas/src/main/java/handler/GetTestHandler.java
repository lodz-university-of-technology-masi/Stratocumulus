package handler;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.PrimaryKey;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import request.GetTestRequest;

public class GetTestHandler implements RequestHandler<GetTestRequest, String> {

    private static final String TABLE_NAME = "Tests";
    private DynamoDB dynamoDB = DynamoDBUtils.getDynamoDB();

    @Override
    public String handleRequest(GetTestRequest getTestRequest, Context context) {
        return dynamoDB.getTable(TABLE_NAME).getItem(new PrimaryKey("id", getTestRequest.getId())).toJSON();
    }
}
