package org.io_web.backend.mock_data;

public class MockPlayer {
    public final String nickname;
    public final String color;
    public final int id;
    public int position;


    public MockPlayer(String nickname, String color, int position, int id) {
        this.nickname = nickname;
        this.color = color;
        this.position = position;
        this.id = id;
    }
}
