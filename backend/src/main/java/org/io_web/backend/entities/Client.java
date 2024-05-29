package org.io_web.backend.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.io_web.backend.client.ClientStatus;

@Setter
@Getter
@Entity
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column()
    private String nickname;

    @Column()
    private String color;

    @Enumerated(EnumType.STRING)
    @Column()
    private ClientStatus status;
}
