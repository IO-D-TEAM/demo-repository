package org.io_web.backend.exceptions;

public class PlayerWithThisIdExistsException extends RuntimeException {
	public PlayerWithThisIdExistsException(String message) {
		super(message);
	}
}
