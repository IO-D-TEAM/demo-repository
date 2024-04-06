package org.io_web.backend.services;

import lombok.Getter;
import lombok.Setter;
import org.io_web.backend.client.Client;
import org.io_web.backend.server.ClientPool;
import org.springframework.stereotype.Service;

/**
 * This is to provide centralized data management
 */
@Service
public class SharedDataService {

    @Getter @Setter
    private String GameCode = "";

    @Getter
    private ClientPool clientPool = new ClientPool();

    public void addNewClient(Client client){
        this.clientPool.add(client);
    }

    public void removeClient(Client client){
        this.clientPool.remove(client);
    }

    public boolean isClientPresent(String nickname){
        return this.clientPool.getClientByNickname(nickname) != null;
    }

}
