package handler;

import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.UpdateItemSpec;
import com.amazonaws.services.dynamodbv2.document.utils.NameMap;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import com.amazonaws.services.dynamodbv2.model.ConditionalCheckFailedException;
import com.amazonaws.services.dynamodbv2.model.ReturnValue;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import model.Test;
import org.json.JSONObject;
import request.RequestInput;
import request.RequestOutput;

public class UpdateTestHandler implements RequestHandler<RequestInput, RequestOutput> {

    private Table table = DynamoDBUtils.getDynamoDB().getTable("Tests");

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        String id = input.getQueryStringParameters().get("id");

        Test test = new Test(input.getBody());

        boolean result = updateTest(id, test);

        JSONObject responseJson = new JSONObject()
                .put("result", result);

        RequestOutput output = new RequestOutput();
        output.setBody(responseJson.toString());
        output.setStatusCode(200);

        return output;
    }

    private boolean updateTest(String id, Test test) {
        try {
            table.updateItem(new UpdateItemSpec()
                    .withConditionExpression("id = :test_id")
                    .withPrimaryKey("id", id)
                    .withUpdateExpression("SET #n = :test_name, " +
                            "#l = :test_lang, " +
                            "#q = :questions")
                    .withNameMap(new NameMap()
                            .with("#n", "name")
                            .with("#l", "language")
                            .with("#q", "questions"))
                    .withValueMap(new ValueMap()
                            .with(":test_id", id)
                            .with(":test_name", test.getName())
                            .with(":test_lang", test.getLanguage())
                            .with(":questions", test.getQuestionsJson()))
                    .withReturnValues(ReturnValue.ALL_OLD));
        } catch (ConditionalCheckFailedException e) {
            return false;
        }

        return true;
    }
}
