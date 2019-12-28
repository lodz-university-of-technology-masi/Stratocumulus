package dynamodb;

import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import org.json.JSONArray;
import org.json.JSONObject;
import request.RequestInput;
import request.RequestOutput;

public class DynamoDBUtils {
    private static final Regions REGION = Regions.US_EAST_1;

    public static DynamoDB getDynamoDB() {
        AmazonDynamoDBClient client = new AmazonDynamoDBClient();
        client.setRegion(Region.getRegion(REGION));
        return new DynamoDB(client);
    }

    public static RequestOutput getItems(RequestInput input, Table table) {
        RequestOutput output = new RequestOutput();
        output.setStatusCode(200);

        if (input.getQueryStringParameters() != null && input.getQueryStringParameters().containsKey("id")) {
            String id = input.getQueryStringParameters().get("id");
            Item foundItem = table.getItem("id", id);
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
}
