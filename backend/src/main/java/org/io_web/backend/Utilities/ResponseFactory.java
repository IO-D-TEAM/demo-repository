package org.io_web.backend.Utilities;

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
    public static <T> ResponseEntity<T> createResponse(HttpStatus status, T body){
        if (body instanceof String messageBody) {

            if (!messageBody.isEmpty()) {
                body = (T) ((String) "{\"message\": \"" + messageBody + "\"}");
            }
        }

        return ResponseEntity.status(status).body(body);
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