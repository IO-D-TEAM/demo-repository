package org.io_web.backend.controllers;

import org.io_web.backend.client.Client;
import org.io_web.backend.client.ClientPool;
import org.io_web.backend.services.CommunicationService;
import org.io_web.backend.services.Settings;
import org.io_web.backend.services.SharedDataService;
import org.io_web.backend.utilities.ResponseFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/lobby")
public class LobbyController {
    private final ClientPool clientPool = new ClientPool();

    private final SharedDataService dataService;
    private final CommunicationService communicationService;

    private final List<Client> clients = new ArrayList<>();

    @Autowired
    public LobbyController(SharedDataService dataService, CommunicationService communicationService){
        this.dataService = dataService;
        this.communicationService = communicationService;
    }

    @GetMapping("/players")
    public ArrayList<Client> sendPlayers() {
        return this.dataService.getClientPool().getClients();
    }

    @PostMapping("/settings")
    public ResponseEntity<String> setSettings(@RequestBody Settings settings){
        dataService.setSettings(settings);

        return ResponseFactory.simpleResponse(HttpStatus.OK);
    }

    @PostMapping("/deletePlayer")
    public ResponseEntity<String> deletePlayer(@RequestBody Client client) {
        this.dataService.getClientPool().removeClient(client);
        return ResponseFactory.simpleResponse(HttpStatus.OK);
    }
}
