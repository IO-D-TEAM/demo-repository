package org.io_web.backend.controllers;

import org.io_web.backend.client.Client;
import org.io_web.backend.client.ClientPool;
import org.io_web.backend.services.CommunicationService;
import org.io_web.backend.services.SharedDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

}
