package org.io_web.backend.services;

import org.io_web.backend.client.ClientPool;
import org.io_web.backend.client.TaskWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.lang.model.type.PrimitiveType;
import java.io.Serializable;


/**
 * This is to provide centralized place to handle
 * socket communication logic
 */
@Service
public class CommunicationService {

    private final SimpMessagingTemplate template;

    private boolean confirmation = false;

    @Autowired
    public CommunicationService(@Qualifier("mySimpMessagingTemplate") SimpMessagingTemplate template) {
        this.template = template;
    }

    /**
     * Task Wrapper is not auto-serializable somehow, so we need to serialize
     * it on our own.
     */
    public void sendMessageToClient(String clientId, Object message) {
        confirmation = false;
        if(message instanceof TaskWrapper taskWrapper)
            template.convertAndSend("/client/" + clientId, taskWrapper.serialize());
        else if(message instanceof Serializable)
            template.convertAndSend("/client/" + clientId, message);
    }

    @MessageMapping("/client/confirmation")
    public void receiveConfirmFromClient(String message){
        if (confirmation) return;
        synchronized (this) {
            confirmation = true;
            this.notifyAll();
        }
    }


    public boolean waitForConfirm() throws InterruptedException{
        if (confirmation) return true;
        wait(10000);
        return confirmation;

    }

    public void sendMessageToLobby(Object message){
        if(message instanceof ClientPool clientPool)
            template.convertAndSend("/lobby/players", clientPool.serialize());
        else if(message instanceof Serializable)
            template.convertAndSend("/lobby/players", message);
    }

    public void sendMessageToBoard(Object message) {
        template.convertAndSend("/move", message);
    }
}
