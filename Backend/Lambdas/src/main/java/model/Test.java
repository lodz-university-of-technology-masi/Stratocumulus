package model;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Test {

    private String id;
    private String name;
    private String language;
    private List<Question> questions;

    public Test(String jsonString) {
        JSONObject json = new JSONObject(jsonString);

        setId(json);
        setName(json);
        setLanguage(json);
        setQuestions(json);
    }

    public String getId() {
        return id;
    }

    private void setId(JSONObject json) {
        if (json.has("id")) {
            id = json.getString("id");
        } else {
            setRandomId();
        }
    }

    private void setRandomId() {
        this.id = UUID.randomUUID().toString();
    }

    public String getName() {
        return name;
    }

    private void setName(JSONObject json) {
        if (json.has("name")) {
            this.name = json.getString("name");
        }
    }

    public String getLanguage() {
        return language;
    }

    private void setLanguage(JSONObject json) {
        if (json.has("language")) {
            this.language = json.getString("language");
        }
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(JSONObject json) {
        if (json.has("questions")) {
            this.questions = new ArrayList<>();

            JSONArray questionsArray = new JSONArray(json.getString("questions"));

            for (int i = 0; i < questionsArray.length(); i++) {
                JSONObject questionObject = questionsArray.getJSONObject(i);
                Question question = new Question(questionObject);
                this.questions.add(question);
            }
        }
    }

    public String getQuestionsJson() {
        JSONArray array = new JSONArray();
        for (Question question : questions) {
            array.put(question.toJsonObject());
        }
        return array.toString();
    }

    public String toJSON() {
        JSONObject json = new JSONObject()
                .put("id", id)
                .put("name", name)
                .put("language", language)
                .put("questions", getQuestionsJson());

        return json.toString();
    }
}
