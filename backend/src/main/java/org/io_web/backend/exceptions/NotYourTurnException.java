package org.io_web.backend.exceptions;

public class NotYourTurnException extends RuntimeException {
	public NotYourTurnException(String message) {
		super(message);
	}
}