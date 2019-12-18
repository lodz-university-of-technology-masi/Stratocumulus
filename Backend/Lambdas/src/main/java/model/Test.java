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

    public Test(String json) {
        JSONObject jsonObject = new JSONObject(json);

        if (jsonObject.has("id")) {
            id = jsonObject.getString("id");
        } else {
            setRandomId();
        }
        setName(jsonObject);
        setLanguage(jsonObject);
        setQuestions(jsonObject);
    }

    public String getId() {
        return id;
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

    @Override
    public String toString() {
        JSONObject json = new JSONObject()
                .put("id", id)
                .put("name", name)
                .put("language", language)
                .put("questions", getQuestionsJson());

        return json.toString();
    }
}
