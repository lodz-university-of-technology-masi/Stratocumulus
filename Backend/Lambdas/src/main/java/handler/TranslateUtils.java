package handler;

import org.json.JSONObject;

import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class TranslateUtils {

    private static String API_KEY = System.getenv("YANDEX_TRANSLATE_API_KEY");

    private static String request(String URL) throws IOException {
        java.net.URL url = new URL(URL);
        URLConnection urlConn = url.openConnection();

        InputStream inStream = urlConn.getInputStream();

        String received = new BufferedReader(new InputStreamReader(inStream)).readLine();

        inStream.close();
        return received;
    }

    public static String translate(String text, String sourceLang, String targetLang) {
        try {
            text = URLEncoder.encode(text, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException e) {
            return "";
        }

        try {
            String responseString = request("https://translate.yandex.net/api/v1.5/tr.json/translate?key=" + API_KEY + "&text=" + text + "&lang=" + sourceLang + "-" + targetLang);
            JSONObject responseJson = new JSONObject(responseString);
            return responseJson.getJSONArray("text").getString(0);
        } catch (IOException e) {
            return "";
        }
    }
}
