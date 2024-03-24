package org.io_web.backend.server;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class Client {

    private final String id = UUID.randomUUID().toString();

    private String nickName;

    private ClientStatus status;

    public Client(String nickName) {
        this.nickName = nickName;
    }

    public Client() {
    }

}
