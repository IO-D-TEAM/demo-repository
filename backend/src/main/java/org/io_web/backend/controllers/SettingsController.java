package org.io_web.backend.controllers;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.io_web.backend.models.Settings;
import org.io_web.backend.payload.BoardConfigurationResponse;
import org.io_web.backend.services.SettingsService;
import org.io_web.backend.utilities.ResponseFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/settings")
public class SettingsController {

    private final SettingsService service;
    private final Logger LOGGER = LogManager.getLogger(SettingsController.class);

    @Autowired
    public SettingsController(SettingsService service) {
        this.service = service;
    }

    /**
     * Get game config
     *
     * @return Response entity with board config
     * @method GET
     */
    @GetMapping("/board")
    public ResponseEntity<String> getBoardConfiguration() {
        LOGGER.info("Get request for board configuration");
        BoardConfigurationResponse configResponse = service.getBoardConfiguration();
        LOGGER.info(configResponse.players());
        return ResponseFactory.createResponse(HttpStatus.OK, configResponse);
    }

    /**
     * Update board settings
     *
     * @param settings new board settings
     * @return update operation status
     */
    @PostMapping("/update")
    public ResponseEntity<String> setSettings(@RequestBody Settings settings) {
        LOGGER.info("Post mapping for settings update");

        service.setSettings(settings);
        return ResponseFactory.simpleResponse(HttpStatus.OK);
    }

    /**
     * Returns valid join game link
     *
     * @return ResponseEntity with valid link or error message
     *
     * <p>>Method is iterating over all network interfaces in computer.
     * Then it iterate over all NI's addresses. If one address is in correct form
     * could be valid address we test it with api call.
     * @method GET
     */
    @GetMapping({"get_url"})
    public ResponseEntity<String> getGameUrl() {
        LOGGER.info("GameUrl GET request handling");

        String joinGameUrl = service.getGameUrl();
        return ResponseFactory.createResponse(HttpStatus.OK, joinGameUrl);
    }

    /**
     * Returns valid game code
     *
     * @return string representing gamecode
     * @method GET
     */
    @GetMapping("/gamecode")
    public String showGeneratedCode() {
        LOGGER.info("showGeneratedCode GET request handler");
        return service.showGeneratedCode();
    }
}
