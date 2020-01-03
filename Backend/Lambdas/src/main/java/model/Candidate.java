package model;

import com.amazonaws.services.cognitoidp.model.AttributeType;
import com.amazonaws.services.cognitoidp.model.UserType;
import org.json.JSONObject;

import java.util.Optional;

public class Candidate {

    private String id;
    private String email;
    private String name;

    public Candidate(String id, String login, String name) {
        this.id = id;
        this.email = login;
        this.name = name;
    }

    public static Candidate convertFromUserType(UserType user) {
        String id = getAttributeIfExists(user, "sub");
        String email = getAttributeIfExists(user, "email");
        String firstName = getAttributeIfExists(user, "name");

        return new Candidate(id, email, firstName);
    }

    private static String getAttributeIfExists(UserType user, String attributeName) {
        Optional<AttributeType> attribute = getUserAttribute(user, attributeName);
        return attribute.map(AttributeType::getValue).orElse(null);
    }

    private static Optional<AttributeType> getUserAttribute(UserType user, String attributeName) {
        return user.getAttributes().stream().filter(attribute -> attribute.getName().equals(attributeName)).findFirst();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public JSONObject toJson() {
        return new JSONObject()
                .put("id", id)
                .put("email", email)
                .put("name", name);
    }
}
