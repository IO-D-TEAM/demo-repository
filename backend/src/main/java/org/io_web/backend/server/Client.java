package org.io_web.backend.server;

/**
 * Client means phone
 */
public class Client {
    private String nickname;
    private int id;
    private ClientStatus status;

    public Client(int id, String nickname){
        this.id = id;
        this.nickname = nickname;
    }

    public String getNickname() {
        return nickname;
    }

    public ClientStatus getStatus() {
        return status;
    }

    public void setStatus(ClientStatus status) {
        this.status = status;
    }

    public int getId(){ return id }
}
