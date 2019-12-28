package handler.test;

import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import request.RequestInput;
import request.RequestOutput;

public class GetTestHandler implements RequestHandler<RequestInput, RequestOutput> {

    private Table table = DynamoDBUtils.getDynamoDB().getTable("Tests");

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        RequestOutput output = new RequestOutput();
        output.setStatusCode(200);

        if (input.getQueryStringParameters() != null && input.getQueryStringParameters().containsKey("id")) {
            String id = input.getQueryStringParameters().get("id");
            Item foundItem = table.getItem("id", id);
            output.setBody(foundItem.toJSON());
        } else {
            JSONArray testsArray = new JSONArray();
            for (Item outcome : table.scan()) {
                testsArray.put(new JSONObject(outcome.toJSON()));
            }
            output.setBody(testsArray.toString());
        }

        return output;
    }
}
