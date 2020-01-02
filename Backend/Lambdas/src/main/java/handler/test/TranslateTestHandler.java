package handler.test;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import model.Test;
import request.RequestInput;
import request.RequestOutput;

import java.util.Map;

public class TranslateTestHandler implements RequestHandler<RequestInput, RequestOutput> {

    @Override
    public RequestOutput handleRequest(RequestInput input, Context context) {
        Test test = new Test(input.getBody());

        RequestOutput output = getBasicOutput();


        Map<String, String> queryParams = input.getQueryStringParameters();
        if (queryParams != null && queryParams.containsKey("lang")
                && queryParams.get("lang").contains("-")) {
            String[] langStrings = input.getQueryStringParameters().get("lang").split("-");
            String sourceLang = langStrings[0];
            String targetLang = langStrings[1];

            Test translatedTest = test.translate(sourceLang, targetLang);
            output.setBody(translatedTest.toJSON());
        } else {
            output.setBody(test.toJSON());
        }

        return output;
    }

    private RequestOutput getBasicOutput() {
        RequestOutput output = new RequestOutput();
        output.setStatusCode(200);
        output.setAccessControlAllowOriginHeader();

        return output;
    }
}
