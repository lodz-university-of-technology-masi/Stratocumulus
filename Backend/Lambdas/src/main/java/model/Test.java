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

        this.id = UUID.randomUUID().toString();
        this.name = jsonObject.getString("name");
        this.language = jsonObject.getString("language");
        this.questions = new ArrayList<>();

        JSONArray questionsArray = new JSONArray(jsonObject.getString("questions"));

        for (int i = 0; i < questionsArray.length(); i++) {
            JSONObject questionObject = questionsArray.getJSONObject(i);
            Question question = new Question(questionObject);
            this.questions.add(question);
        }
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLanguage() {
        return language;
    }

    public List<Question> getQuestions() {
        return questions;
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
