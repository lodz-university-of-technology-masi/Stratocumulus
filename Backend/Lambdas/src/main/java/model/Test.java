package model;

import handler.TranslateUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Test implements Identifiable {

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

    public Test() {
        questions = new ArrayList<>();
        setRandomId();
    }

    @Override
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

    public void setLanguage(String language) {
        this.language = language;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public void addQuestion(Question question) {
        questions.add(question);
    }

    private void setName(String name) {
        this.name = name;
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

            JSONArray questionsArray = json.getJSONArray("questions");

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
        JSONObject jsonObject = new JSONObject();

        if (id != null) {
            jsonObject.put("id", id);
        }

        if (name != null) {
            jsonObject.put("name", name);
        }

        if (language != null) {
            jsonObject.put("language", language);
        }

        if (questions != null) {
            JSONArray questionsArray = new JSONArray();
            for (Question question : questions) {
                questionsArray.put(question.toJsonObject());
            }

            jsonObject.put("questions", questionsArray);
        }

        return jsonObject.toString();
    }

    public Test translate(String sourceLang, String targetLang) {
        Test translatedTest = new Test();
        translatedTest.language = targetLang.toUpperCase();
        translatedTest.name = TranslateUtils.translate(name, sourceLang, targetLang);

        for (Question question : this.questions) {
            translatedTest.addQuestion(question.translate(sourceLang, targetLang));
        }

        return translatedTest;
    }
}
