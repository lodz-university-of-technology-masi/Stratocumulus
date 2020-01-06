package handler.result;

import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import handler.RequestUtils;
import request.RequestInput;
import request.RequestOutput;

public class GetAllTestResultsHandler implements RequestHandler<RequestInput, RequestOutput> {

    private Table table = DynamoDBUtils.getDynamoDB().getTable("TestsResults");

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        return RequestUtils.getAllItems(table);
    }
}
