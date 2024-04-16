package org.io_web.backend.controllers;

import org.io_web.backend.utilities.ResponseFactory;
import org.io_web.backend.client.Client;
import org.io_web.backend.client.ClientPool;
import org.io_web.backend.services.CommunicationService;
import org.io_web.backend.services.Settings;
import org.io_web.backend.services.SharedDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
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

    @PostMapping("/settings")
    public ResponseEntity<String> setSettings(@RequestBody Settings settings){
        dataService.setSettings(settings);
        return ResponseFactory.simpleResponse(HttpStatus.OK);
    }

    @PostMapping("/settings/mock")
    public ResponseEntity<String> setSettings(){
        Settings settings = new Settings(5, 4, 4, 10, 30, new MultipartFile() {

            @Override
            public String getName() {
                return null;
            }

            @Override
            public String getOriginalFilename() {
                return null;
            }

            @Override
            public String getContentType() {
                return null;
            }

            @Override
            public boolean isEmpty() {
                return false;
            }

            @Override
            public long getSize() {
                return 0;
            }

            @Override
            public byte[] getBytes() throws IOException {
                return new byte[0];
            }

            @Override
            public InputStream getInputStream() throws IOException {
                String text;
                text = """
                          [
                          {
                            "question": "What is the capital of France?",
                            "answers": ["Paris", "London", "Berlin", "Rome"],
                            "correctAnswer": "Paris"
                          },
                          {
                            "question": "Who wrote 'Romeo and Juliet'?",
                            "answers": ["William Shakespeare", "Charles Dickens", "Jane Austen", "Leo Tolstoy"],
                            "correctAnswer": "William Shakespeare"
                          },
                          {
                            "question": "What is the chemical symbol for water?",
                            "answers": ["H2O", "CO2", "NaCl", "O2"],
                            "correctAnswer": "H2O"
                          }
                        ]""";
                byte[] byteArray = text.getBytes();
                return new ByteArrayInputStream(byteArray);
            }

            @Override
            public void transferTo(File dest) throws IOException, IllegalStateException {

            }

        });
        dataService.setSettings(settings);
        System.out.println(settings.getQuestions().getFirst());
        return ResponseFactory.simpleResponse(HttpStatus.OK);
    }
}
