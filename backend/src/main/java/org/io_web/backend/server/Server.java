package org.io_web.backend.server;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Needed to handle connection before the game start
 */
@RestController
public class Server implements Runnable{
    private ClientPool clientPool;
    private GameEngine gameEngine;

    public Server() {
        this.gameEngine = new GameEngine();
        this.clientPool = new ClientPool();
    }

    @GetMapping("/lobby")
    public void startGame() {

    }

    @Override
    public void run() {

    }
}
