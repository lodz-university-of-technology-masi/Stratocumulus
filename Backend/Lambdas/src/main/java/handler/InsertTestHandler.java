package handler;

import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import model.Test;
import org.json.JSONObject;
import request.RequestInput;
import request.RequestOutput;

public class InsertTestHandler implements RequestHandler<RequestInput, RequestOutput> {

    private Table table = DynamoDBUtils.getDynamoDB().getTable("Tests");

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        Test test = new Test(input.getBody());

        insertToDatabase(test);

        JSONObject responseJson = new JSONObject();
        responseJson.put("id", test.getId());

        RequestOutput output = new RequestOutput();
        output.setStatusCode(200);
        output.setBody(responseJson.toString());

        return output;
    }

    private void insertToDatabase(Test test) {
        table.putItem(new Item()
                .withString("id", test.getId())
                .withString("name", test.getName())
                .withString("language", test.getLanguage())
                .withJSON("questions", test.getQuestionsJson()));
    }
}
