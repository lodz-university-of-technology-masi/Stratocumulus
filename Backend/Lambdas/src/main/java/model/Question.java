package model;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class Question {

    private String no;
    private String type;
    private String content;
    private int numAnswers; // applicable only for open questions
    private List<String> answers; // applicable only for open questions

    public Question(JSONObject json) {
        setNo(json);
        setType(json);
        setContent(json);
        setNumAnswers(json);
        setAnswers(json);
    }

    public String getNo() {
        return no;
    }

    public void setNo(JSONObject json) {
        if (json.has("no")) {
            no = json.getString("no");
        }
    }

    public String getType() {
        return type;
    }

    public void setType(JSONObject json) {
        if (json.has("type")) {
            type = json.getString("type");
        }
    }

    public String getContent() {
        return content;
    }

    public void setContent(JSONObject json) {
        if (json.has("content")) {
            content = json.getString("content");
        }
    }

    public int getNumAnswers() {
        return numAnswers;
    }

    public void setNumAnswers(JSONObject json) {
        if (json.has("numAnswers")) {
            numAnswers = json.getInt("numAnswers");
        }
    }

    public List<String> getAnswers() {
        return answers;
    }

    public void setAnswers(JSONObject json) {
        if (json.has("answers")) {
            this.answers = new ArrayList<>();

            JSONArray answersArray = json.getJSONArray("answers");
            for (int i = 0; i < answersArray.length(); i++) {
                this.answers.add(answersArray.getString(i));
            }
        }
    }

    public JSONObject toJsonObject() {
        JSONObject json = new JSONObject()
                .put("no", no)
                .put("type", type)
                .put("content", content);

        if (answers != null) {
            json.put("numAnswers", numAnswers);

            JSONArray answersArray = new JSONArray();
            for (String answer : answers) {
                answersArray.put(answer);
            }

            json.put("answers", answersArray);
        }

        return json;
    }
}
