package org.io_web.backend.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import lombok.Getter;
import org.io_web.backend.client.ClientStatus;
import org.io_web.backend.entities.Client;
import org.io_web.backend.models.Settings;
import org.io_web.backend.utilities.GameCodeGenerator;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

/**
 * This is to provide centralized data management
 */
@Service
public class SharedDataService {

    private final ClientService clientService;
    private final SettingsService settingsService;

    @Getter
    private final String gameCode;

    public SharedDataService(ClientService service, @Lazy SettingsService settingsService) {
        this.clientService = service;
        this.settingsService = settingsService;

        this.gameCode = GameCodeGenerator.generate();
    }

    public ArrayList<Client> getClients() {
        return (ArrayList<Client>) this.clientService.getAllClients();
    }

    public void addClient(Client client) {
        this.clientService.createClient(client);
    }

    public Optional<Client> getClient(String clientId) {
        return this.clientService.getClientById(clientId);
    }

    public void removeClient(Client client) {
        this.clientService.deleteClient(String.valueOf(client.getId()));
    }

    public void removeDisconnected() {
        List<Client> clients = this.clientService.getAllClients();
        clients.removeIf(client -> client.getStatus() == ClientStatus.LOST_CONNECTION);
    }

    public Settings getSettings() {
        return this.settingsService.getSettings();
    }
}
