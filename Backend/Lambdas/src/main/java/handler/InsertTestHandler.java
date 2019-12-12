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
import model.Test;

public class InsertTestHandler implements RequestHandler<Test, String> {

    private static final String TABLE_NAME = "Tests";
    private static final Regions REGION = Regions.US_EAST_1;
    private DynamoDB dynamoDb;

    @Override
    public String handleRequest(Test test, Context context) {
        initDynamoDb();
        insertTest(test);

        return "Inserted successfully";
    }

    private PutItemOutcome insertTest(Test test) {
        return dynamoDb.getTable(TABLE_NAME).putItem(new PutItemSpec().withItem(
                new Item()
                        .withString("id", test.getId())
                        .withString("name", test.getName())
                        .withString("language", test.getLanguage())
                        .withJSON("questions", test.getQuestions())
        ));
    }

    private void initDynamoDb() {
        AmazonDynamoDBClient client = new AmazonDynamoDBClient();
        client.setRegion(Region.getRegion(REGION));
        dynamoDb = new DynamoDB(client);
    }
}
