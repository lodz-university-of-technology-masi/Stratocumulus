package handler.candidate;

import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProviderClientBuilder;
import com.amazonaws.services.cognitoidp.model.ListUsersRequest;
import com.amazonaws.services.cognitoidp.model.UserType;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import handler.RequestUtils;
import model.Candidate;
import request.RequestInput;
import request.RequestOutput;

import java.util.List;
import java.util.stream.Collectors;

import static handler.CognitoUtils.filterCandidatesByIdIfPassed;
import static handler.CognitoUtils.getRequestOutput;

public class GetCandidateHandler implements RequestHandler<RequestInput, RequestOutput> {

    private AWSCognitoIdentityProvider cognito = AWSCognitoIdentityProviderClientBuilder.defaultClient();
    private String userPoolId = System.getenv("USER_POOL_ID");

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        if (input.getQueryStringParameters() == null || !input.getQueryStringParameters().containsKey("email")) {
            return RequestUtils.getBasicOutput();
        }

        List<UserType> users = cognito.listUsers(new ListUsersRequest().withUserPoolId(userPoolId)).getUsers();

        List<Candidate> candidates = users.stream().map(Candidate::convertFromUserType).collect(Collectors.toList());

        List<Candidate> filteredCandidates = filterCandidatesByIdIfPassed(input, candidates);

        return getRequestOutput(true, filteredCandidates);
    }
}
