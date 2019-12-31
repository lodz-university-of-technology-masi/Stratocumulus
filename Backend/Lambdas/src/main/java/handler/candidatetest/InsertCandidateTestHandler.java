package handler.candidatetest;

import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import handler.RequestUtils;
import model.CandidateTest;
import request.RequestInput;
import request.RequestOutput;

public class InsertCandidateTestHandler implements RequestHandler<RequestInput, RequestOutput> {

    private Table table = DynamoDBUtils.getDynamoDB().getTable("CandidateTests");

    @Override
    public RequestOutput handleRequest(RequestInput requestInput, Context context) {
        CandidateTest test = new CandidateTest(requestInput.getBody());

        insertToDatabase(test);

        return RequestUtils.getIdOutput(test);
    }

    private void insertToDatabase(CandidateTest test) {
        table.putItem(new Item()
                .withString("id", test.getId())
                .withString("candidateId", test.getCandidateId())
                .withString("testId", test.getTestId())
                .withJSON("answers", test.getAnswersJson().replace("\\", "")));
    }
}
