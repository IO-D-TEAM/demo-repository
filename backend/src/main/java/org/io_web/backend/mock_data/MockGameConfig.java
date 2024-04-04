package org.io_web.backend.mock_data;

public class MockGameConfig {
    public int gameDuration;
    public int boardSize;
    public boolean[] fieldSpeciality;
    public MockPlayer[] players;

    public MockGameConfig(int mockTime, int mockSize) {
        this.gameDuration = mockTime;
        this.boardSize = mockSize;
        this.fieldSpeciality = new boolean[]{
                false, false, false, false, false,
                true, false, false, false, true,
                true, false, false, false, true,
                false, false, false, false, false,
                false, false, false, false, false,
                true, false, false, false, true,
                true, false, false, false, true,
                false, false, false, false, false
        };
        this.players = new MockPlayer[] {
                new MockPlayer("P1", "red", 0, 0),
                new MockPlayer("P2", "blue", 0, 1),
                new MockPlayer("P3", "olive", 0, 2),
                new MockPlayer("P4", "green", 0, 3),
                new MockPlayer("P5", "yellow", 0, 4),
                new MockPlayer("P6", "pink", 0, 5)
        };
    }
}
