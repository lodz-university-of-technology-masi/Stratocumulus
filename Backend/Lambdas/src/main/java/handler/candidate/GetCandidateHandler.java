package handler.candidate;

import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProviderClientBuilder;
import com.amazonaws.services.cognitoidp.model.ListUsersRequest;
import com.amazonaws.services.cognitoidp.model.UserType;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import model.Candidate;
import org.json.JSONArray;
import org.json.JSONObject;
import request.RequestInput;
import request.RequestOutput;

import java.util.List;
import java.util.stream.Collectors;

public class GetCandidateHandler implements RequestHandler<RequestInput, RequestOutput> {

    private AWSCognitoIdentityProvider cognito = AWSCognitoIdentityProviderClientBuilder.defaultClient();
    private String userPoolId = System.getenv("USER_POOL_ID");

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {

        List<UserType> users = cognito.listUsers(new ListUsersRequest().withUserPoolId(userPoolId)).getUsers();

        List<Candidate> candidates = users.stream().map(Candidate::convertFromUserType).collect(Collectors.toList());

        boolean isSingleUser = filterCandidatesByIdIfPassed(input, candidates);

        return getRequestOutput(isSingleUser, candidates);
    }

    private boolean filterCandidatesByIdIfPassed(RequestInput input, List<Candidate> candidates) {
        if (input.getQueryStringParameters() != null && input.getQueryStringParameters().containsKey("id")) {
            String id = input.getQueryStringParameters().get("id");
            candidates = candidates.stream().filter(candidate -> candidate.getId().equals(id))
                    .collect(Collectors.toList());
            return true;
        }

        return false;
    }

    private RequestOutput getRequestOutput(boolean isSingleUser, List<Candidate> candidates) {
        RequestOutput output = new RequestOutput();
        output.setStatusCode(200);
        output.setAccessControlAllowOriginHeader();

        setRequestBody(output, isSingleUser, candidates);

        return output;
    }

    private RequestOutput setRequestBody(RequestOutput output, boolean isSingleUser, List<Candidate> candidates) {
        if (isSingleUser) {
            putCandidateIntoBody(output, candidates.get(0));
        } else {
            putCandidatesIntoBody(output, candidates);
        }

        return output;
    }

    private RequestOutput putCandidateIntoBody(RequestOutput output, Candidate candidate) {
        JSONObject responseJson = candidate.toJson();
        output.setBody(responseJson.toString());

        return output;
    }

    private RequestOutput putCandidatesIntoBody(RequestOutput output, List<Candidate> candidates) {
        JSONArray responseJson = new JSONArray();
        for (Candidate candidate : candidates) {
            responseJson.put(candidate.toJson());
        }

        output.setBody(responseJson.toString());
        return output;
    }
}
