package request;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RequestOutput {
    private boolean isBase64Encoded;
    private int statusCode;
    private Map<String, String> headers;
    private Map<String, List<String>> multiValueHeaders;
    private String body;

    public RequestOutput() {
        headers = new HashMap<>();
        multiValueHeaders = new HashMap<>();
    }

    public boolean isBase64Encoded() {
        return isBase64Encoded;
    }

    public void setBase64Encoded(boolean base64Encoded) {
        isBase64Encoded = base64Encoded;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public Map<String, String> getHeaders() {
        return headers;
    }

    public void setHeaders(Map<String, String> headers) {
        this.headers = headers;
    }

    public void setAccessControlAllowOriginHeader() {
        headers.put("Access-Control-Allow-Origin", "*");
    }

    public Map<String, List<String>> getMultiValueHeaders() {
        return multiValueHeaders;
    }

    public void setMultiValueHeaders(Map<String, List<String>> multiValueHeaders) {
        this.multiValueHeaders = multiValueHeaders;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
}
