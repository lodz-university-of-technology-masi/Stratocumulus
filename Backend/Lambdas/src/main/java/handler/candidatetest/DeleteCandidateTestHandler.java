package handler.candidatetest;

import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import handler.RequestUtils;
import model.CandidateTest;
import org.json.JSONObject;
import request.RequestInput;
import request.RequestOutput;

public class DeleteCandidateTestHandler implements RequestHandler<RequestInput, RequestOutput> {

    private Table table = DynamoDBUtils.getDynamoDB().getTable("CandidateTests");

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        CandidateTest test = new CandidateTest(new JSONObject(input.getQueryStringParameters()).toString());

        return RequestUtils.getBooleanRequestOutput(DynamoDBUtils.deleteFromDatabase(table, test));
    }
}
