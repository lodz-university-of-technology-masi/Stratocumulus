package model;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class CandidateTest implements Identifiable {

    private String id;
    private String candidateId;
    private String testId;
    private List<CandidateAnswer> answers;

    public CandidateTest(String jsonString) {
        JSONObject json = new JSONObject(jsonString);

        setId(json);
        setCandidateId(json);
        setTestId(json);
        setAnswers(json);
    }

    @Override
    public String getId() {
        return id;
    }

    public void setId(JSONObject json) {
        if (json.has("id")) {
            id = json.getString("id");
        } else {
            setRandomId();
        }
    }

    private void setRandomId() {
        id = UUID.randomUUID().toString();
    }

    public String getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(JSONObject json) {
        if (json.has("candidateId")) {
            candidateId = json.getString("candidateId");
        }
    }

    public String getTestId() {
        return testId;
    }

    public void setTestId(JSONObject json) {
        if (json.has("testId")) {
            testId = json.getString("testId");
        }
    }

    public List<CandidateAnswer> getAnswers() {
        return answers;
    }

    public void setAnswers(JSONObject json) {
        if (json.has("answers")) {
            answers = new ArrayList<>();

            JSONArray answersArray = new JSONArray(json.getString("answers"));
            for (int i = 0; i < answersArray.length(); i++) {
                answers.add(new CandidateAnswer(answersArray.getJSONObject(i)));
            }
        }
    }

    public String toJSON() {
        JSONObject json = new JSONObject()
                .put("id", id)
                .put("candidateId", candidateId)
                .put("testId", testId)
                .put("answers", getAnswersJson());

        return json.toString();
    }

    public String getAnswersJson() {
        JSONArray answersArray = new JSONArray();
        for (CandidateAnswer answer : answers) {
            answersArray.put(answer.toJsonObject());
        }

        return answersArray.toString();
    }
}
