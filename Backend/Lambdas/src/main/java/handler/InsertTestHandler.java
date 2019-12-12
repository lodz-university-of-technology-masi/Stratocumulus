package handler;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.PutItemOutcome;
import com.amazonaws.services.dynamodbv2.document.spec.PutItemSpec;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import request.InsertTestRequest;

public class InsertTestHandler implements RequestHandler<InsertTestRequest, String> {

    private static final String TABLE_NAME = "Tests";
    private DynamoDB dynamoDB = DynamoDBUtils.getDynamoDB();

    @Override
    public String handleRequest(InsertTestRequest test, Context context) {
        insertTest(test);

        return "Inserted successfully";
    }

    private PutItemOutcome insertTest(InsertTestRequest test) {
        return dynamoDB.getTable(TABLE_NAME).putItem(new PutItemSpec().withItem(
                new Item()
                        .withString("id", test.getId())
                        .withString("name", test.getName())
                        .withString("language", test.getLanguage())
                        .withJSON("questions", test.getQuestions())
        ));
    }
}
