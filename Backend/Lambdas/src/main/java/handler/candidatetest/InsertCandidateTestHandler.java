package handler.candidatetest;

import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import model.CandidateTests;
import org.json.JSONObject;
import request.RequestInput;
import request.RequestOutput;

public class InsertCandidateTestHandler implements RequestHandler<RequestInput, RequestOutput> {

    private Table table = DynamoDBUtils.getDynamoDB().getTable("CandidateTests");

    @Override
    public RequestOutput handleRequest(RequestInput requestInput, Context context) {
        CandidateTests tests = new CandidateTests(requestInput.getBody());

        insertToDatabase(tests);

        return getCandidateIdOutput(tests.getCandidateId());
    }

    private void insertToDatabase(CandidateTests test) {
        String testsJson = test.getTestsJson();

        Item item = new Item()
                .withString("candidateId", test.getCandidateId());

        if (testsJson != null) {
            item = item.withJSON("assignedTests", testsJson.replace("\\", ""));
        } else {
            item = item.with("assignedTests", JSONObject.NULL);
        }

        table.putItem(item);
    }

    private RequestOutput getCandidateIdOutput(String candidateId) {
        RequestOutput output = getBasicOutput();
        JSONObject response = new JSONObject()
                .put("candidateId", candidateId);

        output.setBody(response.toString());

        return output;
    }

    private RequestOutput getBasicOutput() {
        RequestOutput output = new RequestOutput();
        output.setStatusCode(200);
        output.setAccessControlAllowOriginHeader();

        return output;
    }
}
