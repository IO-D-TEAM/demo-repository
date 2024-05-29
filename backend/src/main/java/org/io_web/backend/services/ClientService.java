package org.io_web.backend.services;

import java.util.List;
import java.util.Optional;

import org.io_web.backend.entities.Client;
import org.io_web.backend.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClientService {
    private final ClientRepository clientRepository;

    @Autowired
    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public void createClient(Client client) {
        clientRepository.save(client);
    }

    // Update operation
    public Client updateClient(String id, Client client) {
        if (clientRepository.existsById(id)) {
            client.setId(Long.valueOf(id));
            return clientRepository.save(client);
        } else {
            // Handle the case where the player with the given id does not exist
            return null; // or throw an exception
        }
    }

    // Delete operation
    public boolean deleteClient(String id) {
        if (clientRepository.existsById(id)) {
            clientRepository.deleteById(id);
            return true;
        } else {
            return false; // Player with given id does not exist
        }
    }

    public Optional<Client> getClientById(String clientId) {
        if (clientId == null || clientId.equals("null")) {
            return Optional.empty();
        }
        return clientRepository.findById(clientId);
    }
}
