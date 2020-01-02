package handler.candidate;

import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProviderClientBuilder;
import com.amazonaws.services.cognitoidp.model.AdminDeleteUserRequest;
import com.amazonaws.services.cognitoidp.model.AdminDeleteUserResult;
import com.amazonaws.services.cognitoidp.model.UserNotFoundException;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import org.json.JSONObject;
import request.RequestInput;
import request.RequestOutput;

public class DeleteCandidateHandler implements RequestHandler<RequestInput, RequestOutput> {

    private AWSCognitoIdentityProvider cognito = AWSCognitoIdentityProviderClientBuilder.defaultClient();
    private String userPoolId = System.getenv("USER_POOL_ID");

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        RequestOutput output = getBasicOutput();

        JSONObject responseJson = new JSONObject();
        if (input.getQueryStringParameters() != null && input.getQueryStringParameters().containsKey("username")) {
            String username = input.getQueryStringParameters().get("username");

            responseJson.put("result", tryDeleteUser(userPoolId, username));

        } else {
            responseJson.put("result", false);
        }

        output.setBody(responseJson.toString());

        return output;
    }

    private boolean tryDeleteUser(String userPoolId, String username) {
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
