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
        this.no = json.getString("no");
        this.type = json.getString("type");
        this.content = json.getString("content");

        if (json.has("numAnswers") && json.has("answers")) {
            this.answers = new ArrayList<>();

            this.numAnswers = json.getInt("numAnswers");

            JSONArray answersArray = json.getJSONArray("answers");
            for (int i = 0; i < answersArray.length(); i++) {
                this.answers.add(answersArray.getString(i));
            }
        }
    }

    public String getNo() {
        return no;
    }

    public void setNo(String no) {
        this.no = no;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getNumAnswers() {
        return numAnswers;
    }

    public void setNumAnswers(int numAnswers) {
        this.numAnswers = numAnswers;
    }

    public List<String> getAnswers() {
        return answers;
    }

    public void setAnswers(List<String> answers) {
        this.answers = answers;
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
