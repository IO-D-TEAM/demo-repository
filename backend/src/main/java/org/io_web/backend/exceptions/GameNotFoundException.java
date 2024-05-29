package org.io_web.backend.exceptions;

public class GameNotFoundException extends RuntimeException {
	public GameNotFoundException(String message) {
		super(message);
	}
}
