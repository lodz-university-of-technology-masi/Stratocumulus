package handler;

import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import model.Identifiable;
import org.json.JSONArray;
import org.json.JSONObject;
import request.RequestInput;
import request.RequestOutput;

public class RequestUtils {
    public static RequestOutput getBooleanRequestOutput(boolean result) {

        JSONObject responseJson = new JSONObject()
                .put("result", result);

        RequestOutput output = getBasicOutput();
        output.setBody(responseJson.toString());

        return output;
    }

    public static RequestOutput getItems(String keyPropertyName, RequestInput input, Table table) {
        RequestOutput output = getBasicOutput();

        if (input.getQueryStringParameters() != null && input.getQueryStringParameters().containsKey(keyPropertyName)) {
            String id = input.getQueryStringParameters().get(keyPropertyName);
            Item foundItem = table.getItem(keyPropertyName, id);
            output.setBody(foundItem.toJSON());
        } else {
            JSONArray testsArray = new JSONArray();
            for (Item outcome : table.scan()) {
                testsArray.put(new JSONObject(outcome.toJSON()));
            }
            output.setBody(testsArray.toString());
        }

        return output;
    }

    public static RequestOutput getSingleItem(String keyPropertyName, RequestInput input, Table table) {
        RequestOutput output = getBasicOutput();

        if (input.getQueryStringParameters() != null && input.getQueryStringParameters().containsKey(keyPropertyName)) {
            String id = input.getQueryStringParameters().get(keyPropertyName);
            Item foundItem = table.getItem(keyPropertyName, id);

            if (foundItem != null) {
                output.setBody(foundItem.toJSON());
            }
        }

        return output;
    }

    public static RequestOutput getAllItems(Table table) {
        RequestOutput output = getBasicOutput();

        JSONArray testsArray = new JSONArray();
        for (Item outcome : table.scan()) {
            testsArray.put(new JSONObject(outcome.toJSON()));
        }
        output.setBody(testsArray.toString());

        return output;
    }

    public static RequestOutput getIdOutput(Identifiable object) {
        JSONObject responseJson = new JSONObject()
                .put("id", object.getId());

        RequestOutput output = getBasicOutput();

        output.setBody(responseJson.toString());

        return output;
    }

    public static RequestOutput getBasicOutput() {
        RequestOutput output = new RequestOutput();
        output.setStatusCode(200);
        output.setAccessControlAllowOriginHeader();

        return output;
    }
}
