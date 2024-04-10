package org.io_web.backend.server;

import org.io_web.backend.questions.Answer;
import org.io_web.backend.questions.Question;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Iterator;
import java.util.List;
import java.util.Random;

/**
 * Needed to handle connection before the game start
 */

@RestController
public class Server implements Runnable {
    private final ClientPool clientPool = new ClientPool();
    private GameEngine gameEngine;
    private String gameCode;

    private final SimpMessagingTemplate template;

    private int maxPlayers = 10,
            currentPlayers = 0;

    @Autowired
    public Server(SimpMessagingTemplate template) {
        this.template = template;
        this.gameEngine = new GameEngine(this);
        this.gameCode = generateGameCode();
        System.out.println(gameCode);
    }

    // Game Engine Communication

    /**
     * Inform client that it's their turn,
     * needed for the client to roll the dice
     */
    public void informClientOfHisTurn(int diceRoll) {
        String clientID = gameEngine.getCurrentMovingPlayerId();
        if (clientID == null) {
            return;
        }
        Response r = new Response(gameEngine.getCurrentTask(), null, diceRoll);

        template.convertAndSend("/client/" + clientID, r);
    }

    /**
     * Send question to client
     * In order to receive it, client will need to be subscribed to a websocket,
     * that is bound to their id - /client/{clientID}
     */
    public void sendQuestion() {
        String clientID = gameEngine.getCurrentMovingPlayerId();
        Question currentQuestion = gameEngine.getCurrentQuestion();
        if (clientID == null || currentQuestion == null) {
            return;
        }

        Response r = new Response(gameEngine.getCurrentTask(), currentQuestion, null);
        template.convertAndSend("/client/" + clientID, r);
    }

    // Server logic
    private String generateGameCode() {
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
    // Entering the Lobby Losts are erased, Spectators -> Connected, Ending game - Losts erased
    public void gameStatusChanged(){
        Iterator<Client> iterator = clientPool.getClients().iterator();
        Client client;
        if (gameEngine.getGameStatus() != GameStatus.PENDING) {
            while (iterator.hasNext()) {
                client = iterator.next();
                if (client.getStatus() == ClientStatus.LOST_CONNECTION) {
                    iterator.remove();
                    gameEngine.removePlayer(client.getId());
                }
            }
        }
        if (gameEngine.getGameStatus() == GameStatus.LOBBY) {
            iterator = clientPool.getClients().iterator();
            while (iterator.hasNext()) {
                client = iterator.next();
                if (client.getStatus() == ClientStatus.SPECTATOR) {
                    client.setStatus(ClientStatus.CONNECTED);
                    gameEngine.addPlayer(client.getId());
                }
            }
        }
    }

    private Response createMessageResponse(HttpStatus status, String message) {
        Response response = new Response();
        response.setStatus(status);
        response.setMessage(message);
        return response;
    }

    private Response createResponse(HttpStatus status) {
        Response response = new Response();
        response.setStatus(status);
        response.setGameStatus(gameEngine.getGameStatus());
        return response;
    }


    private Response createResponse(HttpStatus status, Client client) {
        Response response = new Response();
        response.setStatus(status);
        response.setClientId(client.getId());
        response.setGameStatus(gameEngine.getGameStatus());
        if(client.getId().equals(gameEngine.getCurrentMovingPlayerId())){
            if (gameEngine.getCurrentTask() == PlayerTask.ANSWERING_QUESTION) {
                response.setQuestion(gameEngine.getCurrentQuestion());
                response.setTask(PlayerTask.ANSWERING_QUESTION);
            }
            else {
                response.setTask(PlayerTask.THROWING_DICE);
            }
        }
        response.setTask(PlayerTask.IDLE);


        return response;
    }


    @GetMapping("/gamecode")
    public String showGeneratedCode() {
        return this.gameCode;
    }

    @GetMapping("/lobby")
    public List<Client> sendPlayers() {
        return this.clientPool.getClients();
    }

    // Client joins game
    @GetMapping("{gameCode}/join_game")
    public Response mainPage(@PathVariable String gameCode) {
        if (!gameCode.equals(this.gameCode)) {
            return createMessageResponse(HttpStatus.NOT_FOUND, "No game with that code");
        }
        return createResponse(HttpStatus.OK);

    }

    // Client tries to join game, gives his nickname
    @PostMapping("{gameCode}/join_game")
    public Response joinGame(@PathVariable String gameCode, @RequestBody Client newClient) {
        if (!gameCode.equals(this.gameCode)) {
            return createMessageResponse(HttpStatus.NOT_FOUND, "No game with that code");
        }
        boolean reconnected = false;
        Response response = null;

        switch (gameEngine.getGameStatus()) {
            case LOBBY, ENDED:
                if (clientPool.getClientByNickname(newClient.getNickname()) != null) {
                    return createMessageResponse(HttpStatus.CONFLICT, "Nickname already in use");
                }
                break;
            case PENDING:
                Client prevClient = clientPool.getClientByNickname(newClient.getNickname());
                if (prevClient != null) {
                    if (prevClient.getStatus() == ClientStatus.LOST_CONNECTION) {
                        prevClient.setStatus(ClientStatus.CONNECTED);
                        response = createResponse(HttpStatus.OK, prevClient);
                        reconnected = true;

                    } else {
                        return createMessageResponse(HttpStatus.CONFLICT, "Nickname already in use");

                    }
                } else if (this.maxPlayers == this.currentPlayers) {
                        return createMessageResponse(HttpStatus.CONFLICT, "Lobby full");
                }
                newClient.setStatus(ClientStatus.SPECTATOR);

        }

        if (!reconnected) {
            this.clientPool.add(newClient);
            gameEngine.addPlayer(newClient.getId());
            response = createResponse(HttpStatus.OK, newClient);
        }
        // nauczyciel
        template.convertAndSend("/lobby/players", this.clientPool);

        return response;

    }
    // client observes game, getting information about throwing, questions
    @GetMapping("{gameCode}/{clientID}")
    public Response attendGame(@PathVariable String gameCode, @PathVariable String clientID) {
        if (!gameCode.equals(this.gameCode)) {
            return createMessageResponse(HttpStatus.NOT_FOUND, "No game with that code");
        }
        Client client = clientPool.getClientById(clientID);
        if (client == null) {
            return createMessageResponse(HttpStatus.UNAUTHORIZED, "No client with this id");
        }

        return createResponse(HttpStatus.OK, client);
    }

    // client sends his answer
    @PostMapping("{gameCode}/{clientID}")
    public Response giveAnswer(@PathVariable String gameCode, @PathVariable String clientID, @RequestBody Answer answer) {
        if (!gameCode.equals(this.gameCode)) {
            return createMessageResponse(HttpStatus.NOT_FOUND, "No game with that code");
        }
        Client client = clientPool.getClientById(clientID);
        if (client == null) {
            return createMessageResponse(HttpStatus.UNAUTHORIZED, "No client with this id");
        }
        if (!client.getId().equals((gameEngine.getCurrentMovingPlayerId()))) {
            return createMessageResponse(HttpStatus.FORBIDDEN, "Not your turn");
        }

        gameEngine.playerAnswered(answer);
        return createResponse(HttpStatus.ACCEPTED, client);
    }

    @Override
    public void run() {

    }
}
