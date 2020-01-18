package handler.test;

import com.amazonaws.services.dynamodbv2.document.*;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import handler.RequestUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import request.RequestInput;
import request.RequestOutput;

public class GetAllTestsHandler implements RequestHandler<RequestInput, RequestOutput> {

    private Table table = DynamoDBUtils.getDynamoDB().getTable("Tests");

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        RequestOutput output = RequestUtils.getBasicOutput();

        String recruiterId = null;

        if (input.getQueryStringParameters() != null && input.getQueryStringParameters().containsKey("recruiterEmail")) {
            recruiterId = input.getQueryStringParameters().get("recruiterEmail");
        }

        JSONArray tests = new JSONArray();

        ItemCollection<ScanOutcome> foundTests;

        if (recruiterId != null) {
            foundTests = table.scan(new ScanFilter("recruiterEmail").eq(recruiterId));
        } else {
            foundTests = table.scan();
        }

        for (Item item : foundTests) {
            tests.put(new JSONObject(item.toJSON()));
        }

        output.setBody(tests.toString());

        return output;
    }
}
