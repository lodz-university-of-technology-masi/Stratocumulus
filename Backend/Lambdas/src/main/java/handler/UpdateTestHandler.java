package handler;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.PrimaryKey;
import com.amazonaws.services.dynamodbv2.document.UpdateItemOutcome;
import com.amazonaws.services.dynamodbv2.document.spec.UpdateItemSpec;
import com.amazonaws.services.dynamodbv2.document.utils.NameMap;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import request.UpdateTestRequest;

public class UpdateTestHandler implements RequestHandler<UpdateTestRequest, String> {

    private static final String TABLE_NAME = "Tests";
    private DynamoDB dynamoDB = DynamoDBUtils.getDynamoDB();

    @Override
    public String handleRequest(UpdateTestRequest updateTestHandler, Context context) {
        updateItem(updateTestHandler);

        return "Updated successfully";
    }

    private UpdateItemOutcome updateItem(UpdateTestRequest updateTestHandler) {
        return dynamoDB.getTable(TABLE_NAME).updateItem(new UpdateItemSpec()
                .withPrimaryKey(new PrimaryKey("id", updateTestHandler.getId()))
                .withUpdateExpression("SET #n = :test_name, " +
                        "#l = :test_lang," +
                        "#q = :questions")
                .withNameMap(new NameMap()
                        .with("#n", "name")
                        .with("#l", "language")
                        .with("#q", "questions")
                )
                .withValueMap(new ValueMap()
                        .with(":test_name", updateTestHandler.getName())
                        .with(":test_lang", updateTestHandler.getLanguage())
                        .with(":questions", updateTestHandler.getQuestions()))
        );
    }
}
