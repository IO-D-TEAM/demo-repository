package org.io_web.backend.controllers;

import org.io_web.backend.client.Client;
import org.io_web.backend.game.GameEngine;
import org.io_web.backend.services.CommunicationService;
import org.io_web.backend.services.SharedDataService;
import org.io_web.backend.utilities.ResponseFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/players")
public class PlayerController {

    private final SharedDataService dataService;

    @Autowired
    public PlayerController(SharedDataService dataService){
        this.dataService = dataService;
    }

    /**
     * Handles situation when client is observing the game. Provide user with information
     * about questions, dice throwing etc.
     *
     * @param gameCode Unique game identifier
     * @param clientID Unique user identifier
     * @return ResponseEntity wih HttpStatus and Game Data.
     */
    @GetMapping("/{gameCode}/client/{clientID}")
    public ResponseEntity<Object> getPlayerData(@PathVariable String gameCode, @PathVariable String clientID) {
        if (!gameCode.equals(this.dataService.getGameCode())) {
            return ResponseFactory.createResponse(HttpStatus.NOT_FOUND, "Game not found");
        }

        Client client = this.dataService.getClientPool().getClientById(clientID);

        if (client == null) {
            return ResponseFactory.createResponse(HttpStatus.UNAUTHORIZED, "No client with this id");
        }

        return ResponseFactory.createResponse(HttpStatus.OK, client);
    }
}
