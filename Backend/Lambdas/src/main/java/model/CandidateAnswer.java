package model;

import org.json.JSONObject;

public class CandidateAnswer {

    private String questionNo;
    private String answer;

    public CandidateAnswer(JSONObject json) {
        setQuestionNo(json);
        setAnswer(json);
    }

    public String getQuestionNo() {
        return questionNo;
    }

    public void setQuestionNo(JSONObject json) {
        if (json.has("questionNo")) {
            questionNo = json.getString("questionNo");
        }
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(JSONObject json) {
        if (json.has("answer")) {
            answer = json.getString("answer");
        }
    }

    public JSONObject toJsonObject() {
        return new JSONObject()
                .put("questionNo", questionNo)
                .put("answer", answer);
    }
}
