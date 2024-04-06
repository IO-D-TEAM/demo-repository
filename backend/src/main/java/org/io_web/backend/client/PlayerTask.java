package org.io_web.backend.client;

import org.io_web.backend.questions.Question;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.io.ByteArrayOutputStream;
import java.io.ObjectOutputStream;

/**
 * PlayerTask serves as a wrapper containing all the necessary information
 * for a player to complete their task.
 */
public enum PlayerTask {
    THROWING_DICE,
    ANSWERING_QUESTION,
    IDLE;
}