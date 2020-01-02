package model;

import handler.TranslateUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class Question {

    private String no;
    private String type;
    private String content;
    private int numAnswers; // applicable only for closed questions
    private List<String> answers; // applicable only for closed questions

    public Question(JSONObject json) {
        setNo(json);
        setType(json);
        setContent(json);
        setNumAnswers(json);
        setAnswers(json);
    }

    public Question() {
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

    public void setNo(String no) {
        this.no = no;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setNumAnswers(int numAnswers) {
        this.numAnswers = numAnswers;
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


    public Question translate(String sourceLang, String targetLang) {
        Question translatedQuestion = new Question();
        translatedQuestion.no = no;
        translatedQuestion.numAnswers = numAnswers;
        translatedQuestion.content = TranslateUtils.translate(content, sourceLang, targetLang);
        translatedQuestion.type = type;

        if (answers != null) {
            List<String> translatedAnswers = new ArrayList<>();
            for (String answer : answers) {
                translatedAnswers.add(TranslateUtils.translate(answer, sourceLang, targetLang));
            }
            translatedQuestion.answers = translatedAnswers;
        }

        return translatedQuestion;
    }
}
