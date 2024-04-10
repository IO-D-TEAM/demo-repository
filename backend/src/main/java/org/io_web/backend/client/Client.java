package org.io_web.backend.client;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class Client {

    private final String id = UUID.randomUUID().toString();
    private String nickname;
    private ClientStatus status;

    @JsonCreator
    public Client(@JsonProperty("nickname") String nickName) {
        this.nickname = nickName;
    }

}
