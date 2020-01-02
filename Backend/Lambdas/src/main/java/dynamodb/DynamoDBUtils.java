package dynamodb;

import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.document.DeleteItemOutcome;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.DeleteItemSpec;
import com.amazonaws.services.dynamodbv2.model.ReturnValue;
import model.Identifiable;

public class DynamoDBUtils {
    private static final Regions REGION = Regions.US_EAST_1;

    public static DynamoDB getDynamoDB() {
        AmazonDynamoDBClient client = new AmazonDynamoDBClient();
        client.setRegion(Region.getRegion(REGION));
        return new DynamoDB(client);
    }

    public static boolean deleteFromDatabase(Table table, Identifiable object) {
        DeleteItemOutcome outcome = table.deleteItem(new DeleteItemSpec()
                .withPrimaryKey("id", object.getId())
                .withReturnValues(ReturnValue.ALL_OLD));

        return outcome.getDeleteItemResult().getAttributes() != null;
    }
}
