package org.io_web.backend.server;

import java.util.HashMap;
import java.util.Random;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.io_web.backend.board.Player;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;


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
    private final List<Client> clientPool = new ArrayList<>();
    private GameEngine gameEngine;
    private String gameCode;

    private int maxPlayers = 10,
                currentPlayers = 0,
                newID = 0;


    public Server() {
        this.gameEngine = new GameEngine();
        this.gameCode = generateGameCode();
    }

    // Game Engine Communication
    private int addNewClient(String nickname){
        Client client = new Client(this.newID, nickname);
        clientPool.add(client);
        this.newID += 1;
        return this.newID - 1;
    }

    /*
        Server logic
     */
    private String generateGameCode(){
        String allowedCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            int randomIndex = random.nextInt(allowedCharacters.length());
            char randomChar = allowedCharacters.charAt(randomIndex);

            stringBuilder.append(randomChar);
        }
        return stringBuilder.toString();
    }
    private final List<Client> clients = new ArrayList<>();

    private final SimpMessagingTemplate template;

    @Autowired
    public Server(SimpMessagingTemplate template) {
        this.template = template;
    }



    private ResponseEntity<String> createResponse(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(message);
    }

    private ResponseEntity<String> createResponseFromMap(HttpStatus status, HashMap<String, Object> map){
        ObjectMapper objectMapper = new ObjectMapper();
        String json = null;
        try {
            json = objectMapper.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            createResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Problem occurred when converting json response");
        }
        return createResponse(status, json);
    }
    // Client joins game
    @GetMapping("{gameCode}/join_game")
    public ResponseEntity<String> mainPage(@PathVariable String gameCode){
        if (!gameCode.equals(this.gameCode)){
            return createResponse(HttpStatus.NOT_FOUND, "No game with that code");
        }
        HashMap<String, Object> map = new HashMap<>();
        map.put("game_status", this.gameEngine.getGameStatus());
        return createResponseFromMap(HttpStatus.OK, map);

    }

    @PostMapping("/addNickname")
    public ResponseEntity<Void> sendMessage(@RequestBody Client client) {
        System.out.println(client.getNickName());
        this.clients.add(client);
        template.convertAndSend("/lobby/players", this.clients);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    // Client tries to join game, gives his nickname
    @PostMapping("{gameCode}/join_game")
    public ResponseEntity<String> joinGame(@PathVariable String gameCode, @RequestBody String nickname){
        if (!gameCode.equals(this.gameCode)){
            return createResponse(HttpStatus.NOT_FOUND, "No game with that code");
        }
        boolean reconnected = false;
        int ID = -1;
        switch (gameEngine.getGameStatus()){
            case LOBBY, ENDED:
                for (Client client : clientPool) {
                    if (client.getNickname().equals(nickname)) {
                        return createResponse(HttpStatus.CONFLICT, "Nickname already in use");
                    }
                }
                break;
            case PENDING:
                for (Client client : clientPool){
                    if(client.getNickname().equals(nickname)){
                        if (client.getStatus() == ClientStatus.LOST_CONNECTION){
                            client.setStatus(ClientStatus.CONNECTED);
                            /*
                            ewenutalnia informacja dla Game Engine'a
                             */
                            ID = client.getId();
                            reconnected = true;
                            break;
                        }
                        else{
                            return createResponse(HttpStatus.CONFLICT, "Nickname already in use");
                        }
                    }
                }
                if(!reconnected && this.maxPlayers == this.currentPlayers){
                    return createResponse(HttpStatus.CONFLICT, "Lobby full");
                }
                break;

        }
        HashMap<String, Object> map = new HashMap<>();

        if (!reconnected){
            ID = addNewClient(nickname);
        }

        map.put("ID", Integer.toString(ID));
        map.put("game_status", this.gameEngine.getGameStatus().toString());
        return createResponseFromMap(HttpStatus.OK, map);

    }

    @GetMapping("{gameCode}/{clientID}")
    public ResponseEntity<String> attendGame(@PathVariable String gameCode, @PathVariable String clientID) throws JsonProcessingException {
        if (!gameCode.equals(this.gameCode)) return createResponse(HttpStatus.NOT_FOUND, "No game with that code");
        int id;
        try{
            id = Integer.parseInt(clientID);
        }
        catch (NumberFormatException e){ return createResponse(HttpStatus.UNAUTHORIZED, "Wrong client number");}
        // ZMIENIĆ
        if (!clientPool.contains(id)) return createResponse(HttpStatus.UNAUTHORIZED, "No client with this id");

        HashMap<String, Object> map = new HashMap<>();
        map.put("ID", Integer.toString(id));
        map.put("game_status", this.gameEngine.getGameStatus().toString());
        if (gameEngine.getGameStatus() == GameStatus.PENDING) {
            if (gameEngine.getCurrentMovingPlayerId() == id) {
                map.put("answering", "true");
                map.put("question", gameEngine.getCurrentQuestion());
                ObjectMapper objectMapper = new ObjectMapper();
                String answersList = objectMapper.writeValueAsString(gameEngine.getCurrentAnswers());
                map.put("answers", answersList);
            } else {
                map.put("answering", "false");
            }
        }
        return createResponseFromMap(HttpStatus.OK, map);
    }


    @PostMapping("{gameCode}/{clientID}")
    public ResponseEntity<String> giveAnswer(@PathVariable String gameCode, @PathVariable String clientID, @RequestBody String answer){
        if (!gameCode.equals(this.gameCode)) return createResponse(HttpStatus.NOT_FOUND, "No game with that code");
        int id;
        try{
            id = Integer.parseInt(clientID);
        }
        catch (NumberFormatException e){ return createResponse(HttpStatus.UNAUTHORIZED, "Wrong client number");}

        // ZMIENIĆ
        if (!clientPool.contains(id)) return createResponse(HttpStatus.UNAUTHORIZED, "No client with this id");


        return createResponse(HttpStatus.ACCEPTED, "ok");

    }
    @Override
    public void run() {

    }
}
