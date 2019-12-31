package handler.candidatetest;

import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.UpdateItemSpec;
import com.amazonaws.services.dynamodbv2.document.utils.NameMap;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.ConditionalCheckFailedException;
import com.amazonaws.services.dynamodbv2.model.ReturnValue;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import handler.RequestUtils;
import model.CandidateTest;
import request.RequestInput;
import request.RequestOutput;

public class UpdateCandidateTestHandler implements RequestHandler<RequestInput, RequestOutput> {

    private Table table = DynamoDBUtils.getDynamoDB().getTable("CandidateTests");

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        String id = input.getQueryStringParameters().get("id");

        CandidateTest test = new CandidateTest(input.getBody());

        boolean result = updateCandidateTest(id, test);

        return RequestUtils.getBooleanRequestOutput(result);
    }

    private boolean updateCandidateTest(String id, CandidateTest test) {
        try {
            table.updateItem(new UpdateItemSpec()
                    .withConditionExpression("id = :candidatetest_id")
                    .withPrimaryKey("id", id)
                    .withUpdateExpression("SET #c = :candidate_id, " +
                            "#t = :test_id, " +
                            "#a = :answers")
                    .withNameMap(new NameMap()
                            .with("#c", "candidateId")
                            .with("#t", "testId")
                            .with("#a", "answers"))
                    .withValueMap(new ValueMap()
                            .with(":candidatetest_id", id)
                            .with(":candidate_id", test.getCandidateId())
                            .with(":test_id", test.getTestId())
                            .with(":answers", test.getAnswersJson()))
                    .withReturnValues(ReturnValue.ALL_OLD));
        } catch (ConditionalCheckFailedException e) {
            return false;
        }

        return true;
    }
}
