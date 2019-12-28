package handler.candidatetest;

import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import request.RequestInput;
import request.RequestOutput;

import static dynamodb.DynamoDBUtils.getItems;

public class GetCandidateTestHandler implements RequestHandler<RequestInput, RequestOutput> {

    private Table table = DynamoDBUtils.getDynamoDB().getTable("CandidateTests");

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        return getItems(input, table);
    }
}
