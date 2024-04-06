package org.io_web.backend.services;

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

    @Autowired
    public CommunicationService(@Qualifier("mySimpMessagingTemplate") SimpMessagingTemplate template) {
        this.template = template;
    }

    public void sendMessageToClient(String clientId, Object message) {
        template.convertAndSend("/client/" + clientId, message);
    }


    public void sendMessageToLobby(Object message){
        template.convertAndSend("/lobby/players", message);
    }
}