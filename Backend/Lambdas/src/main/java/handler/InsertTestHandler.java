package handler;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import model.Test;
import org.json.JSONObject;
import request.RequestInput;
import request.RequestOutput;

public class InsertTestHandler implements RequestHandler<RequestInput, RequestOutput> {

    private static final String TABLE_NAME = "Tests";
    private DynamoDB dynamoDB = DynamoDBUtils.getDynamoDB();

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        Test test = new Test(input.getBody());

        RequestOutput output = new RequestOutput();
        output.setStatusCode(200);

        JSONObject responseJson = new JSONObject();
        responseJson.put("id", test.getId());

        insertToDatabase(test);

        output.setBody(responseJson.toString());

        return output;
    }

    private void insertToDatabase(Test test) {
        dynamoDB.getTable(TABLE_NAME).putItem(new Item()
                .withString("id", test.getId())
                .withString("name", test.getName())
                .withString("language", test.getLanguage())
                .withJSON("questions", test.getQuestionsJson()));
    }
}
