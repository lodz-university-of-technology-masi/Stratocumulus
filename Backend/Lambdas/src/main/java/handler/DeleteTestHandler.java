package handler;

import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import model.Test;
import org.json.JSONObject;
import request.RequestInput;
import request.RequestOutput;

public class DeleteTestHandler implements RequestHandler<RequestInput, RequestOutput> {

    private Table table = DynamoDBUtils.getDynamoDB().getTable("Tests");

    @Override
    public RequestOutput handleRequest(RequestInput requestInput, Context context) {
        Test test = new Test(new JSONObject(requestInput.getQueryStringParameters()).toString());

        deleteFromDatabase(test);

        JSONObject responseJson = new JSONObject()
                .put("isSuccess", true);

        RequestOutput output = new RequestOutput();
        output.setStatusCode(200);
        output.setBody(responseJson.toString());

        return output;
    }

    private void deleteFromDatabase(Test test) {
        table.deleteItem("id", test.getId());
    }
}
