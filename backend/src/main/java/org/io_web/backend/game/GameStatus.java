package org.io_web.backend.game;

public enum GameStatus {
    LOBBY("lobby"),
    PENDING("pending"),
    ENDED("ended");

    private final String name;

    GameStatus(String name){
        this.name = name;
    }

    @Override
    public String toString(){
        return name;
    }
}
