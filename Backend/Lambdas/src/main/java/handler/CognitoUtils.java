package handler;

import model.Candidate;
import org.json.JSONArray;
import org.json.JSONObject;
import request.RequestInput;
import request.RequestOutput;

import java.util.List;
import java.util.stream.Collectors;

public class CognitoUtils {

    public static List<Candidate> filterCandidatesByIdIfPassed(RequestInput input, List<Candidate> candidates) {
        if (input.getQueryStringParameters() != null && input.getQueryStringParameters().containsKey("email")) {
            String email = input.getQueryStringParameters().get("email");
            return candidates.stream().filter(candidate -> candidate.getEmail().equals(email))
                    .collect(Collectors.toList());
        }

        return candidates;
    }

    public static RequestOutput getRequestOutput(boolean isSingleUser, List<Candidate> candidates) {
        RequestOutput output = new RequestOutput();
        output.setStatusCode(200);
        output.setAccessControlAllowOriginHeader();

        setRequestBody(output, isSingleUser, candidates);

        return output;
    }

    public static RequestOutput setRequestBody(RequestOutput output, boolean isSingleUser, List<Candidate> candidates) {
        if (isSingleUser && !candidates.isEmpty()) {
            putCandidateIntoBody(output, candidates.get(0));
        } else if (!candidates.isEmpty()) {
            putCandidatesIntoBody(output, candidates);
        } else {
            putNullIntoBody(output);
        }

        return output;
    }

    public static RequestOutput putNullIntoBody(RequestOutput output) {
        output.setBody(null);

        return output;
    }

    public static RequestOutput putCandidateIntoBody(RequestOutput output, Candidate candidate) {
        JSONObject responseJson = candidate.toJson();
        output.setBody(responseJson.toString());

        return output;
    }

    public static RequestOutput putCandidatesIntoBody(RequestOutput output, List<Candidate> candidates) {
        JSONArray responseJson = new JSONArray();
        for (Candidate candidate : candidates) {
            responseJson.put(candidate.toJson());
        }

        output.setBody(responseJson.toString());
        return output;
    }
}
