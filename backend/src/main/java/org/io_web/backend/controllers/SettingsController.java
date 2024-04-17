package org.io_web.backend.controllers;

import org.io_web.backend.board.Field;
import org.io_web.backend.board.Player;
import org.io_web.backend.controllers.payload.BoardConfigurationResponse;
import org.io_web.backend.game.GameEngine;
import org.io_web.backend.services.Settings;
import org.io_web.backend.services.SharedDataService;
import org.io_web.backend.utilities.NetworkUtils;
import org.io_web.backend.utilities.ResponseFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/settings")
public class SettingsController {

    private final SharedDataService dataService;
    private final GameEngine gameEngine;

    @Autowired
    public SettingsController(SharedDataService dataService, GameEngine gameEngine){
        this.gameEngine = gameEngine;
        this.dataService = dataService;
    }

    private String generateRandomColor() {
        Color playerColor = new Color((int) (Math.random() * 0x1000000));
        return String.format("rgb(%d, %d, %d)", playerColor.getRed(), playerColor.getGreen(), playerColor.getBlue());
    }

    @GetMapping("/board")
    public ResponseEntity<Object> getBoardConfiguration() {

        gameEngine.loadSettings(dataService.getSettings());
//        gameEngine.start();
        BoardConfigurationResponse configResponse = new BoardConfigurationResponse(
                dataService.getSettings().getTimeForGame(),
                gameEngine.getBoard().getPath().size(),
                gameEngine.getBoard().getPath(),
                gameEngine.getPlayersList()
        );

        return ResponseFactory.createResponse(HttpStatus.OK, configResponse);
    }

    /**
     * Returns valid join game link
     *
     * @method GET
     * @return ResponseEntity with valid link or error message
     *
     * <p>>Method is iterating over all network interfaces in computer.
     * Then it iterate over all NI's addresses. If one address is in correct form
     * could be valid address we test it with api call.
     */
    @GetMapping({"get_url"})
    public ResponseEntity<String> getGameUrl(){
        String joinGameUrl = NetworkUtils.createUrl(this.dataService.getGameCode());

        if(joinGameUrl != null)
            return ResponseFactory.createResponse(HttpStatus.OK, joinGameUrl);

        return ResponseFactory.createResponse(HttpStatus.SERVICE_UNAVAILABLE, "Message unavailable!");
    }

    @PostMapping("/update")
    public ResponseEntity<String> setSettings(@RequestBody Settings settings){
        dataService.setSettings(settings);
        System.out.println(settings.getQuestions());
        return ResponseFactory.simpleResponse(HttpStatus.OK);
    }

    /**
     * Returns Game Code
     *
     * @method GET
     * @return ResponseEntity wih HttpStatus and Game Data.
     */
    @GetMapping("/gamecode")
    public String showGeneratedCode() {
        return this.dataService.getGameCode();
    }

    @PostMapping("/mockTest")
    public ResponseEntity<String> setSettings(){
//        dataService.setSettings(MockSettings.getMockSettings()); // For settings test
        return ResponseFactory.simpleResponse(HttpStatus.OK);
    }
}
