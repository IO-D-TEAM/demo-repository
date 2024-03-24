package org.io_web.backend.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

/**
 * Needed to handle connection before the game start
 */

@RestController
public class Server implements Runnable{
    private GameEngine gameEngine;
    private final List<Client> clients = new ArrayList<>();

    private final SimpMessagingTemplate template;

    @Autowired
    public Server(SimpMessagingTemplate template) {
        this.template = template;
    }

    @PostMapping("/addNickname")
    public ResponseEntity<Void> sendMessage(@RequestBody Client client) {
        System.out.println(client.getNickName());
        this.clients.add(client);
        template.convertAndSend("/lobby/players", this.clients);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Override
    public void run() {

    }
}
