package handler;

import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.PutItemOutcome;
import com.amazonaws.services.dynamodbv2.document.spec.PutItemSpec;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import request.TestRequest;

public class InsertTestHandler implements RequestHandler<TestRequest, String> {

    private final String TABLE_NAME = "Tests";
    private final Regions REGION = Regions.US_EAST_1;
    private DynamoDB dynamoDb;

    @Override
    public String handleRequest(TestRequest testRequest, Context context) {
        initDynamoDb();
        insertTest(testRequest);

        return "Inserted successfully";
    }

    private PutItemOutcome insertTest(TestRequest test) {
        return dynamoDb.getTable(TABLE_NAME).putItem(new PutItemSpec().withItem(
                new Item()
                        .withString("Id", test.getId())
                        .withString("Name", test.getName())
                        .withString("Language", test.getLanguage())
        ));
    }

    private void initDynamoDb() {
        AmazonDynamoDBClient client = new AmazonDynamoDBClient();
        client.setRegion(Region.getRegion(REGION));
        dynamoDb = new DynamoDB(client);
    }
}
