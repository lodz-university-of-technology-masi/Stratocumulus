package model;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class TestResult implements Identifiable {
    private static final String ID_DELIMITER = System.getenv("ID_DELIMITER");

    private String id;
    private List<Integer> points;

    public TestResult(String json) {
        JSONObject jsonObject = new JSONObject(json);

        setId(jsonObject);
        setPoints(jsonObject);
    }

    @Override
    public String getId() {
        return id;
    }

    private void setId(JSONObject jsonObject) {
        if (jsonObject.has("candidateId") && jsonObject.has("testId")) {
            id = jsonObject.getString("candidateId") + ID_DELIMITER + jsonObject.getString("testId");
        }
    }

    private void setPoints(JSONObject jsonObject) {
        if (jsonObject.has("points")) {
            points = new ArrayList<>();
            JSONArray pointsArray = jsonObject.getJSONArray("points");
            for (int i = 0; i < pointsArray.length(); i++) {
                points.add(pointsArray.getInt(i));
            }
        }
    }

    public String getPointsJson() {
        JSONArray pointsArray = new JSONArray();
        for (int point : points) {
            pointsArray.put(point);
        }

        return pointsArray.toString();
    }
}
