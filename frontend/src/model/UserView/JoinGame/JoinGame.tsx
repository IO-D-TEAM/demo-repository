import React, { FC, useState, useEffect } from 'react';
import Stomp from 'stompjs'
import SockJS from 'sockjs-client'

interface JoinGameProps {}

const JoinGame: FC<JoinGameProps> = () => {
  const [gamecode, setGamecode] = useState('');
  const [nickname, setNickname] = useState('');
  const [clientId, setClientId] = useState('');
  const [stompClient, setStompClient] = useState<Stomp.Client>()

  const WS_URL = "http://localhost:8080/ws"
  useEffect(() => {
    if (clientId == "" || stompClient != null) return;
    const socket = new SockJS(WS_URL)
    const client = Stomp.over(socket)

    client.connect({}, () => {
      client.subscribe(`/client/${clientId}`, (notification) => {
        //TODO handle incomming questions
      })
    })

    setStompClient(client)
  }, [clientId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`/game/${gamecode}/join_game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname: nickname }),
      });


      if (!response.ok) {
          throw new Error("Failed to connect to server");
      }
      const data = await response.json();
      console.log(data);

      // server error - can't register the client
      if (!response.ok) {
          throw new Error(data.message);
      }

      setClientId(data.id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Kod gry: 
        <input
          type="text"
          value={gamecode}
          onChange={(e) => setGamecode(e.target.value)}
        />
      </label>
      <br />
      <label>
        Nazwa gracza: 
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
      {clientId && <p>Client ID: {clientId}</p>}
    </form>
  );
};

export default JoinGame;
