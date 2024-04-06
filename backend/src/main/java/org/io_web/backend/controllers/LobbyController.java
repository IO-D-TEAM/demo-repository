package org.io_web.backend.controllers;

import org.io_web.backend.client.Client;
import org.io_web.backend.server.ClientPool;
import org.io_web.backend.services.CommunicationService;
import org.io_web.backend.services.SharedDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("/lobby")
public class LobbyController {
    private final ClientPool clientPool = new ClientPool();

    private final SharedDataService dataService;
    private final CommunicationService communicationService;

    @Autowired
    public LobbyController(SharedDataService dataService, CommunicationService communicationService){
        this.dataService = dataService;
        this.communicationService = communicationService;
    }

    @GetMapping("/players")
    public ArrayList<Client> sendPlayers() {
        return this.dataService.getClientPool().getClients();
    }

}
