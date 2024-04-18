package org.io_web.backend.client;


import java.io.Serializable;

/**
 * PlayerTask serves as a wrapper containing all the necessary information
 * for a player to complete their task.
 */
public enum PlayerTask implements Serializable {
    THROWING_DICE,
    ANSWERING_QUESTION,
    IDLE,
    DELETED,
}
