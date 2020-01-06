package handler.result;

import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import handler.RequestUtils;
import model.TestResult;
import request.RequestInput;
import request.RequestOutput;

public class InsertTestResultHandler implements RequestHandler<RequestInput, RequestOutput> {

    private Table table = DynamoDBUtils.getDynamoDB().getTable("TestsResults");

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        TestResult testResult = new TestResult(input.getBody());

        insertToDatabase(testResult);

        return RequestUtils.getIdOutput(testResult);
    }

    private void insertToDatabase(TestResult testResult) {
        table.putItem(new Item()
                .withString("id", testResult.getId())
                .withJSON("results", testResult.getPointsJson()));
    }
}
