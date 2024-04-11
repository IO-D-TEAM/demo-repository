package org.io_web.backend.services;

import lombok.Getter;
import lombok.Setter;
import org.io_web.backend.client.ClientPool;
import org.io_web.backend.questions.Question;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

/**
 * This is to provide centralized data management
 */
@Getter
@Service
public class SharedDataService {

    @Setter
    private String GameCode = "";

    private final ClientPool clientPool = new ClientPool();

    private ArrayList<Question> questions;

    private long timeForAnswer = 20000;
}
