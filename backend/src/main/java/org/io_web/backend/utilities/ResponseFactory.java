package org.io_web.backend.utilities;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity.BodyBuilder;

/**
 * Similar to prev Response class.
 * Provide two ways of creating Response.
 * <br>
 * 1) ResponseFactory.createResponse(HttpStatus, WrappedData);
 * 2) ResponseFactory.status(HttpStatus).body(WrappedData);
 */
public class ResponseFactory {
    private static final ObjectMapper objectMapper = new ObjectMapper();


    public static <T> ResponseEntity<String> createResponse(HttpStatus status, T body) {
        try {
            String responseBody;
            if (body instanceof String) {
                responseBody = "{\"message\": \"" + body + "\"}";
            } else {
                responseBody = objectMapper.writeValueAsString(body);
            }
            return ResponseEntity.status(status).body(responseBody);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Serialization error\"}");
        }
    }

    public static ResponseEntity<String> simpleResponse(HttpStatus status) {
        return ResponseEntity.status(status).build();
    }

    public static BodyBuilder status(HttpStatus status) {
        return ResponseEntity.status(status);
    }

    public static <T> ResponseEntity<T> body(T body) {
        return ResponseEntity.ok().body(body);
    }
}
