package org.io_web.backend.server;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

/**
 * Clas needed to manage clients
 */
@Getter
public class ClientPool {

    ArrayList<Client> clients = new ArrayList<>();

    public Client getClientByNickname(String nickname){
        for (Client client : clients){
            if (client.getNickname().equals(nickname)) return client;
        }
        return null;
    }
    public Client getClientById(String id){
        for (Client client : clients){
            if (client.getId().equals(id)) return client;
        }
        return null;
    }

    public void add(Client client){
        clients.add(client);
    }

    public void remove(Client client){
        clients.remove(client);
    }

    public void remove(String id){
        for (Client client : clients){
            if (client.getId().equals(id)){
                clients.remove(client);
                return;
            }
        }
    }

}
