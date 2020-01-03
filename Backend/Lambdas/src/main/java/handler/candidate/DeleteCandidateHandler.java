package handler.candidate;

import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProviderClientBuilder;
import com.amazonaws.services.cognitoidp.model.*;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import dynamodb.DynamoDBUtils;
import model.CandidateTests;
import org.json.JSONObject;
import request.RequestInput;
import request.RequestOutput;

import java.util.List;

public class DeleteCandidateHandler implements RequestHandler<RequestInput, RequestOutput> {

    private AWSCognitoIdentityProvider cognito = AWSCognitoIdentityProviderClientBuilder.defaultClient();
    private String userPoolId = System.getenv("USER_POOL_ID");

    private Table table = DynamoDBUtils.getDynamoDB().getTable("CandidateTests");

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        RequestOutput output = getBasicOutput();

        JSONObject responseJson = new JSONObject();
        if (input.getQueryStringParameters() != null && input.getQueryStringParameters().containsKey("username")) {
            String username = input.getQueryStringParameters().get("username");
            responseJson.put("result", tryDeleteUser(username));

            String candidateId = getUserIdByUsername(username);
            deleteCandidateTestsFromDatabase(candidateId);
        } else {
            responseJson.put("result", false);
        }

        output.setBody(responseJson.toString());

        return output;
    }

    private String getUserIdByUsername(String username) {
        List<AttributeType> attributes = cognito.adminGetUser(new AdminGetUserRequest().withUsername(username)).getUserAttributes();
        for (AttributeType attribute : attributes) {
            if (attribute.getName().equals("sub")) {
                return attribute.getValue();
            }
        }

        return null;
    }

    private void deleteCandidateTestsFromDatabase(String candidateId) {
        JSONObject testsJsonObject = new JSONObject()
                .put("candidateId", candidateId);

        CandidateTests tests = new CandidateTests(testsJsonObject.toString());

        DynamoDBUtils.deleteFromDatabase("candidateId", table, tests);
    }

    private boolean tryDeleteUser(String username) {
        cognito.adminGetUser(new AdminGetUserRequest().withUsername(username)).getUserAttributes();
        try {
            AdminDeleteUserResult result = cognito.adminDeleteUser(new AdminDeleteUserRequest()
                    .withUserPoolId(userPoolId)
                    .withUsername(username));
            return true;
        } catch (UserNotFoundException e) {
            return false;
        }
    }

    private RequestOutput getBasicOutput() {
        RequestOutput output = new RequestOutput();
        output.setStatusCode(200);
        output.setAccessControlAllowOriginHeader();

        return output;
    }
}
