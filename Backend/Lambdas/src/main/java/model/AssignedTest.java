package model;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class AssignedTest {

    private String testId;
    private List<String> answers;

    public AssignedTest(JSONObject jsonObject) {
        setTestId(jsonObject);
        setAnswers(jsonObject);
    }

    public String getTestId() {
        return testId;
    }

    public void setTestId(String testId) {
        this.testId = testId;
    }

    private void setTestId(JSONObject jsonObject) {
        if (jsonObject.has("testId")) {
            testId = jsonObject.getString("testId");
        }
    }

    public List<String> getAnswers() {
        return answers;
    }

    private void setAnswers(JSONObject jsonObject) {
        if (jsonObject.has("answers") && jsonObject.get("answers") != JSONObject.NULL) {
            answers = new ArrayList<>();

            JSONArray answersArray = jsonObject.getJSONArray("answers");
            for (int i = 0; i < answersArray.length(); i++) {
                String answer = answersArray.getString(i);
                answers.add(answer);
            }
        }
    }

    public void setAnswers(List<String> answers) {
        this.answers = answers;
    }

    public JSONObject toJsonObject() {
        JSONObject jsonObject = new JSONObject();

        if (testId != null) {
            jsonObject.put("testId", testId);
        }

        if (answers != null) {
            JSONArray answersArray = new JSONArray();
            for (String answer : answers) {
                answersArray.put(answer);
            }

            jsonObject.put("answers", answers);
        } else {
            jsonObject.put("answers", JSONObject.NULL);
        }

        return jsonObject;
    }
}
