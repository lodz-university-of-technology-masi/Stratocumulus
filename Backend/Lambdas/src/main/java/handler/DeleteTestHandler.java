package handler;

import com.amazonaws.services.dynamodbv2.document.DeleteItemOutcome;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.PrimaryKey;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import request.DeleteTestRequest;

public class DeleteTestHandler implements RequestHandler<DeleteTestRequest, String> {

    private static final String TABLE_NAME = "Tests";
    private DynamoDB dynamoDB = DynamoDBUtils.getDynamoDB();

    @Override
    public String handleRequest(DeleteTestRequest deleteTestRequest, Context context) {
        deleteTest(deleteTestRequest);

        return "Deleted successfully";
    }

    private DeleteItemOutcome deleteTest(DeleteTestRequest deleteTestRequest) {
        return dynamoDB.getTable(TABLE_NAME).deleteItem(new PrimaryKey("id", deleteTestRequest.getId()));
    }
}
