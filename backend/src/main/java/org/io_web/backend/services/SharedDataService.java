package org.io_web.backend.services;

import lombok.Getter;
import lombok.Setter;
import org.io_web.backend.client.ClientPool;
import org.springframework.stereotype.Service;

/**
 * This is to provide centralized data management
 */
@Getter
@Service
public class SharedDataService {

    @Setter
    private String GameCode = "";

    private final ClientPool clientPool = new ClientPool();

    @Setter
    private Settings settings;

}
