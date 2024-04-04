package org.io_web.backend.server;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Clas needed to manage clients
 */
@Getter
public class ClientPool {

    ArrayList<Client> clients = new ArrayList<>();

    public Client getClientByNickname(String nickname){
        Optional<Client> searchedClient = clients.stream().filter(client -> client.getNickname().equals(nickname)).findFirst();
        return searchedClient.orElse(null);
    }
    public Client getClientById(String id){
        Optional<Client> searchedClient = clients.stream().filter(client -> client.getId().equals(id)).findFirst();
        return searchedClient.orElse(null);
    }

    public void add(Client client){
        clients.add(client);
    }

    public void remove(Client client){
        clients.remove(client);
    }

    public void remove(String id){
        clients.removeIf(client -> !client.getId().equals(id));
    }

}
