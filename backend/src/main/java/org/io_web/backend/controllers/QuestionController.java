package org.io_web.backend.controllers;

import org.io_web.backend.questions.Question;
import org.io_web.backend.services.CommunicationService;
import org.io_web.backend.services.SharedDataService;
import org.io_web.backend.utilities.ResponseFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/questions")
public class QuestionController {

    private final SharedDataService dataService;
    @Autowired
    public QuestionController(SharedDataService dataService){
        this.dataService = dataService;
    }

    @PostMapping("/")
    public ResponseEntity<String> addQuestions(@RequestBody Question[] questions){
        // Set Questions on main controller
        return ResponseFactory.createResponse(HttpStatus.OK, "OK");
    }


}
