package handler.candidatetest;

import com.amazonaws.services.dynamodbv2.document.DeleteItemOutcome;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.DeleteItemSpec;
import com.amazonaws.services.dynamodbv2.model.ReturnValue;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import model.CandidateTest;
import org.json.JSONObject;
import request.RequestInput;
import request.RequestOutput;

public class DeleteCandidateTestHandler implements RequestHandler<RequestInput, RequestOutput> {

    private Table table = DynamoDBUtils.getDynamoDB().getTable("CandidateTests");

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        CandidateTest test = new CandidateTest(new JSONObject(input.getQueryStringParameters()).toString());

        boolean result = deleteFromDatabase(test);

        JSONObject responseJson = new JSONObject()
                .put("result", result);

        RequestOutput output = new RequestOutput();
        output.setStatusCode(200);
        output.setBody(responseJson.toString());

        return output;
    }

    private boolean deleteFromDatabase(CandidateTest test) {
        DeleteItemOutcome outcome = table.deleteItem(new DeleteItemSpec()
                .withPrimaryKey("id", test.getId())
                .withReturnValues(ReturnValue.ALL_OLD));

        return outcome.getDeleteItemResult().getAttributes() != null;
    }
}
