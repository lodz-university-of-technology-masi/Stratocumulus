package model;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class CandidateTests implements Identifiable {

    private String candidateId;
    private List<AssignedTest> assignedTests;

    public CandidateTests(String json) {
        JSONObject jsonObject = new JSONObject(json);

        setCandidateId(jsonObject);
        setAssignedTests(jsonObject);
    }

    @Override
    public String getId() {
        return getCandidateId();
    }

    public String getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(String candidateId) {
        this.candidateId = candidateId;
    }

    private void setCandidateId(JSONObject jsonObject) {
        if (jsonObject.has("candidateId")) {
            candidateId = jsonObject.getString("candidateId");
        }
    }

    public List<AssignedTest> getAssignedTests() {
        return assignedTests;
    }

    public void setAssignedTests(List<AssignedTest> assignedTests) {
        this.assignedTests = assignedTests;
    }

    private void setAssignedTests(JSONObject jsonObject) {
        if (jsonObject.has("assignedTests") && jsonObject.get("assignedTests") != JSONObject.NULL) {
            assignedTests = new ArrayList<>();

            JSONArray testsArray = jsonObject.getJSONArray("assignedTests");
            for (int i = 0; i < testsArray.length(); i++) {
                JSONObject testJsonObject = testsArray.getJSONObject(i);
                assignedTests.add(new AssignedTest(testJsonObject));
            }
        }
    }

    public String getTestsJson() {
        if (assignedTests != null) {
            JSONArray testsArray = new JSONArray();

            for (AssignedTest test : assignedTests) {
                testsArray.put(test.toJsonObject());
            }

            return testsArray.toString();
        } else {
            return null;
        }
    }

    public String toJSON() {
        JSONObject jsonObject = new JSONObject();

        if (candidateId != null) {
            jsonObject.put("candidateId", candidateId);
        }

        if (assignedTests != null) {
            JSONArray testsArray = new JSONArray();
            for (AssignedTest test : assignedTests) {
                testsArray.put(test.toJsonObject());
            }

            jsonObject.put("assignedTests", testsArray);
        } else {
            jsonObject.put("assignedTests", JSONObject.NULL);
        }

        return jsonObject.toString();
    }
}
