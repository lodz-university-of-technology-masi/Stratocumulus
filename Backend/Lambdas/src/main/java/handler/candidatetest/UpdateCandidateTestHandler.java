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
import model.CandidateTests;
import request.RequestInput;
import request.RequestOutput;

public class UpdateCandidateTestHandler implements RequestHandler<RequestInput, RequestOutput> {

    private Table table = DynamoDBUtils.getDynamoDB().getTable("CandidateTests");

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        if (input.getQueryStringParameters() != null && input.getQueryStringParameters().containsKey("candidateId")) {
            String id = input.getQueryStringParameters().get("candidateId");

            CandidateTests tests = new CandidateTests(input.getBody());

            boolean result = updateCandidateTest(id, tests);

            return RequestUtils.getBooleanRequestOutput(result);
        } else {
            return RequestUtils.getBooleanRequestOutput(false);
        }
    }

    private boolean updateCandidateTest(String id, CandidateTests test) {
        try {
            ValueMap map = new ValueMap()
                    .with(":candidate_id", id);

            String testsJson = test.getTestsJson();

            if (testsJson != null) {
                map.withJSON(":assigned_tests", testsJson.replace("\\", ""));
            } else {
                map.withNull(":assigned_tests");
            }

            table.updateItem(new UpdateItemSpec()
                    .withConditionExpression("candidateId = :candidate_id")
                    .withPrimaryKey("candidateId", id)
                    .withUpdateExpression("SET #a = :assigned_tests")
                    .withNameMap(new NameMap()
                            .with("#a", "assignedTests"))
                    .withValueMap(map)
                    .withReturnValues(ReturnValue.ALL_OLD));
        } catch (ConditionalCheckFailedException e) {
            return false;
        }

        return true;
    }
}
