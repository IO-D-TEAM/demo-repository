package org.io_web.backend.services;

import java.util.ArrayList;

import lombok.Getter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.io_web.backend.controllers.SettingsController;
import org.io_web.backend.game.GameEngine;
import org.io_web.backend.models.Settings;
import org.io_web.backend.payload.BoardConfigurationResponse;
import org.io_web.backend.utilities.NetworkUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class SettingsService {

    private final SharedDataService dataService;
    private final GameEngine gameEngine;
    private final Logger LOGGER = LogManager.getLogger(SettingsController.class);

    @Getter
    private Settings settings = new Settings();

    @Autowired
    public SettingsService(SharedDataService dataService, GameEngine gameEngine) {
        this.gameEngine = gameEngine;
        this.dataService = dataService;
    }

    public BoardConfigurationResponse getBoardConfiguration() {
        LOGGER.info("getBoardConfiguration function called");
        gameEngine.addPlayers(dataService.getClients());
        
        LOGGER.info(new ArrayList<>(gameEngine.getPlayerList()));

        return gameEngine.getBoardConfig();
    }

    public void setSettings(@RequestBody Settings settings) {
        LOGGER.info("setSettings function called");

        this.settings = settings;
        gameEngine.loadSettings(settings);
    }

    public String getGameUrl() {
        LOGGER.info("getGameUrl function called");
        return NetworkUtils.createUrl(this.dataService.getGameCode());
    }

    public String showGeneratedCode() {
        return this.dataService.getGameCode();
    }
}
