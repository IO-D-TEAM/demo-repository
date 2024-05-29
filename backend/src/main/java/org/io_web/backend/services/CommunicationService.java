package org.io_web.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * This is to provide centralized place to handle
 * socket communication logic
 */
@Service
public class CommunicationService {

    private final SimpMessagingTemplate template;
    @Getter
    @Setter
    private boolean confirmation = false;

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private final Logger LOGGER = LogManager.getLogger(CommunicationService.class);


    @Autowired
    public CommunicationService(@Qualifier("mySimpMessagingTemplate") SimpMessagingTemplate template) {
        this.template = template;
    }

    /**
     * Task Wrapper is not auto-serializable somehow, so we need to serialize
     * it on our own.
     */
    public void sendMessageToClient(String clientId, Object message) {
        try {
            byte[] responseBody = objectMapper.writeValueAsBytes(message);
            template.convertAndSend("/client/" + clientId, responseBody);
        } catch (Exception e) {
            LOGGER.error("Could not send message to client: {}", e.getMessage());
        }
    }

    synchronized public boolean waitForConfirm(int seconds) throws InterruptedException {
//        if (confirmation) {
//            return true;
//        }
//        wait(seconds * 1000L);
//        return confirmation;
        return false;
    }

    public void sendMessageToLobby(Object message) {
        try {
            byte[] responseBody = objectMapper.writeValueAsBytes(message);
            template.convertAndSend("/lobby/players", responseBody);
        } catch (Exception e) {
            LOGGER.error("Could not send message to lobby: {}", e.getMessage());
        }
    }

    public void sendMessageToBoard(Object message) {
        try {
            byte[] responseBody = objectMapper.writeValueAsBytes(message);
            template.convertAndSend("/move", responseBody);
        } catch (Exception e) {
            LOGGER.error("Could not send message to board: {}", e.getMessage());
        }
    }
}
