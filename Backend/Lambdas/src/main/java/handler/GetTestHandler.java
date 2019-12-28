package handler;

import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import request.RequestInput;
import request.RequestOutput;

public class GetTestHandler implements RequestHandler<RequestInput, RequestOutput> {

    private Table table = DynamoDBUtils.getDynamoDB().getTable("Tests");

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        String id = input.getQueryStringParameters().get("id");

        Item foundItem = table.getItem("id", id);

        RequestOutput output = new RequestOutput();
        output.setBody(foundItem.toJSON());
        output.setStatusCode(200);

        return output;
    }
}
