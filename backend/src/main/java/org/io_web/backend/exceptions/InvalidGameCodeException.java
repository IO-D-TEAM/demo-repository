package org.io_web.backend.exceptions;

public class InvalidGameCodeException extends RuntimeException {
	public InvalidGameCodeException(String message) {
		super(message);
	}
}
