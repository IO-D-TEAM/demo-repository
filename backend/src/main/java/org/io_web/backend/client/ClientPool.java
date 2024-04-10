package org.io_web.backend.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import org.io_web.backend.client.Client;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Optional;

/**
 * Clas needed to manage clients
 */
@Getter
public class ClientPool implements Serializable {
    ArrayList<Client> clients = new ArrayList<>();

    public Client getClientByNickname(String nickname){
        Optional<Client> searchedClient = clients.stream().filter(client -> client.getNickname().equals(nickname)).findFirst();
        return searchedClient.orElse(null);
    }


    public Client getClientById(String id){
        Optional<Client> searchedClient = clients.stream().filter(client -> client.getId().equals(id)).findFirst();
        return searchedClient.orElse(null);
    }

    public void addNewClient(Client client){
        clients.add(client);
    }

    public void removeClient(Client client){
        clients.remove(client);
    }

    public void remove(String id){
        clients.removeIf(client -> !client.getId().equals(id));
    }


    public boolean isClientPresent(String nickname){
        return getClientByNickname(nickname) != null;
    }

    public byte[] serialize() {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsBytes(this);
        } catch (JsonProcessingException e){
            return new byte[0];
        }
    }

}
