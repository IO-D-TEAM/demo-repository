package org.io_web.backend.services;

import java.awt.*;
import java.util.List;
import java.util.Optional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.io_web.backend.client.ClientStatus;
import org.io_web.backend.client.PlayerTask;
import org.io_web.backend.client.TaskWrapper;
import org.io_web.backend.controllers.LobbyController;
import org.io_web.backend.entities.Client;
import org.io_web.backend.game.GameEngine;
import org.io_web.backend.utilities.ColorPool;
import org.io_web.backend.utilities.ResponseFactory;
import org.io_web.backend.utilities.ValidationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class LobbyService {

    private final Logger LOGGER = LogManager.getLogger(LobbyController.class);
    private final SharedDataService dataService;
    private final CommunicationService communicationService;
    private final GameEngine gameEngine;

    @Autowired
    public LobbyService(SharedDataService dataService, CommunicationService communicationService, GameEngine gameEngine) {
        this.gameEngine = gameEngine;
        this.communicationService = communicationService;
        this.dataService = dataService;
    }

    public List<Client> getClients() {
        LOGGER.info("getClients");
        return this.dataService.getClients();
    }

    public void validateGamecode(String gameCode) {
        LOGGER.info("validateGamecode");
        ValidationUtils.validateGame(gameCode, dataService.getGameCode());
    }

    private String generateRandomColor() {
        Color playerColor = new Color((int) (Math.random() * 0x1000000));
        return String.format("rgb(%d, %d, %d)", playerColor.getRed(), playerColor.getGreen(), playerColor.getBlue());
    }


    public Client attendGame(String gameCode, String clientID) {
        LOGGER.info("attendGame for gameCode: {} clientID {}", gameCode, clientID);
        ValidationUtils.validateGame(gameCode, dataService.getGameCode());
        ValidationUtils.validateIfUniquePlayer(dataService.getClient(clientID));

        Client client = new Client();
        client.setId(Long.valueOf(clientID));

        this.dataService.addClient(client);

        Optional<Client> newClient = this.dataService.getClient(clientID);
        ValidationUtils.validateNotNull(newClient);

        return newClient.get();
    }

    public Client joinGame(String gameCode, Client newClient2) {
        LOGGER.info("joinGame for gameCode: {} client {}", gameCode, newClient2);

        ValidationUtils.validateGame(gameCode, dataService.getGameCode());

        boolean reconnected = false;
        Optional<Client> response = Optional.empty();

        switch (gameEngine.getGameStatus()) {
            case LOBBY, ENDED:
                ValidationUtils.validateIfUniquePlayer(dataService.getClient(String.valueOf(newClient2.getId())));
                break;
            case PENDING:
                Optional<Client> prevClient2 = this.dataService.getClient(String.valueOf(newClient2.getId()));
                ValidationUtils.validateNotNull(prevClient2);

                if (prevClient2.isPresent()) {

                    if (prevClient2.get().getStatus() == ClientStatus.LOST_CONNECTION) {
                        prevClient2.get().setStatus(ClientStatus.CONNECTED);
                        response = prevClient2;
                        reconnected = true;

                    }
                }

        }

        if (newClient2.getColor().isEmpty()) {
            newClient2.setColor(ColorPool.generateColor());
        }

        if (!reconnected) {
            this.dataService.addClient(newClient2);
            response = Optional.of(newClient2);
        }

        this.communicationService.sendMessageToLobby(this.dataService.getClients());
        return response.get();
    }

    @PostMapping("/deletePlayer")
    public ResponseEntity<String> deletePlayer(@RequestBody Client client2) {
        this.dataService.removeClient(client2);

        TaskWrapper task = new TaskWrapper(null, null, PlayerTask.DELETED);
        System.out.println("[LOG] Post-Mapping deletePlayer");
        this.communicationService.sendMessageToClient(String.valueOf(client2.getId()), task);
        return ResponseFactory.simpleResponse(HttpStatus.OK);
    }

}
