package org.io_web.backend.models;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Properties;

import lombok.Getter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


@Getter
public class Settings {
    private int numberOfPlayers;
    private int normalFields;
    private int specialFields;
    private int timeForAnswer;
    private int timeForGame;

    private final Logger LOGGER = LogManager.getLogger(Settings.class);

    private final ArrayList<Question> questions;

    public Settings() {
        loadDefaultSettings();
        this.questions = createDefaultQuestions();
    }

    @Override
    public String toString() {
        return "Settings{" +
                "numberOfPlayers=" + numberOfPlayers +
                ", normalFields=" + normalFields +
                ", specialFields=" + specialFields +
                ", timeForAnswer=" + timeForAnswer +
                ", timeForGame=" + timeForGame +
                ", questions=" + questions +
                '}';
    }

    private void loadDefaultSettings() {
        LOGGER.info("Loading Default Settings!");
        Properties properties = new Properties();
        try (InputStream input = getClass().getClassLoader().getResourceAsStream("gameconfig.properties")) {
            if (input == null) {
                System.out.println("Sorry, unable to find gameconfig.properties");
                return;
            }

            // Load the properties file
            properties.load(input);

            // Set properties
            numberOfPlayers = Integer.parseInt(properties.getProperty("numberOfPlayers", "0"));
            normalFields = Integer.parseInt(properties.getProperty("normalFields", "0"));
            specialFields = Integer.parseInt(properties.getProperty("specialFields", "0"));
            timeForAnswer = Integer.parseInt(properties.getProperty("timeForAnswer", "0"));
            timeForGame = Integer.parseInt(properties.getProperty("timeForGame", "0"));
        } catch (IOException ex) {
            LOGGER.error("Could not load default settings: {}", ex.getMessage());
        }
    }

    private ArrayList<Question> createDefaultQuestions() {
        ArrayList<Question> questions = new ArrayList<>();
        questions.add(new Question(
                "What is the capital of France?",
                new String[]{"Paris", "London", "Berlin", "Madrid"},
                "Paris"
        ));
        questions.add(new Question(
                "Who wrote 'Hamlet'?",
                new String[]{"William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"},
                "William Shakespeare"
        ));
        questions.add(new Question(
                "What is the largest planet in our solar system?",
                new String[]{"Earth", "Mars", "Jupiter", "Saturn"},
                "Jupiter"
        ));
        // Add more questions as needed
        return questions;
    }

}
