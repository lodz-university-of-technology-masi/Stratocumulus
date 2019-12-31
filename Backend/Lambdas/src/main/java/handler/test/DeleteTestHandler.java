package handler.test;

import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import handler.RequestUtils;
import model.Test;
import org.json.JSONObject;
import request.RequestInput;
import request.RequestOutput;

public class DeleteTestHandler implements RequestHandler<RequestInput, RequestOutput> {

    private Table table = DynamoDBUtils.getDynamoDB().getTable("Tests");

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        Test test = new Test(new JSONObject(input.getQueryStringParameters()).toString());

        return RequestUtils.getBooleanRequestOutput(DynamoDBUtils.deleteFromDatabase(table, test));
    }
}
