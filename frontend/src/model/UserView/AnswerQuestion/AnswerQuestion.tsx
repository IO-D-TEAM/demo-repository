import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useParams } from 'react-router-dom';

interface ServerMessage {
  question: string;
  answers: string[];
  correctAnswer: string;
}

const AnswerQuestion: React.FC = () => {

  // Params for client-server communication? 
  const { clientId, gameId } = useParams<{ clientId: string, gameId: string }>();

  const [serverMessage, setServerMessage] = useState<ServerMessage|null>(null);
  const [rollDiceResult, setRollDiceResult] = useState<number|null>(null);
  let stompClient: Stomp.Client|null = null;

  const [error, setError] = useState(null);

  const WS_URL = "http://localhost:8080/ws";

  useEffect(() => {
    const socket = new SockJS(WS_URL);
    stompClient = Stomp.over(socket);

    // Client subscribes to channel with his ID
    stompClient.connect({}, (frame: any) => {

      console.log('Connected: ' + frame);

      stompClient?.subscribe(`/client/${clientId}`, message => {
        const messageBody: ServerMessage = JSON.parse(message.body);
        setServerMessage(messageBody);
      });
    });

    return () => {
      if (stompClient && stompClient.connected) { // Check if client is connected before disconnecting
        stompClient.disconnect(() => { });
      }
    };
  }, []);

  const handleRollDice = () => {
    const diceRollResult = Math.floor(Math.random() * 6) + 1;
    setRollDiceResult(diceRollResult);
  }

  const sendAnswerToServer = async (answer: string) => {
    try {
      const response = await fetch(`http://localhost:8080/${gameId}/${clientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dice: 6,
          answer: answer
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      console.log('Response data:', data);
    } catch (error) {
    }
  };

  return (
    <div>
      {serverMessage ? (
        <div>
          {rollDiceResult === null ? (
            <button onClick={handleRollDice}>Roll Dice</button>
          ) : (
            <div>
              <h2>Question:</h2>
              <p>{serverMessage.question}</p>
              <h3>Answers:</h3>

              <div className="answer-section">
                {serverMessage.answers.map((answerOption, index) => (
                  <button key={index} onClick={() => sendAnswerToServer(answerOption)} >
                    {answerOption}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div> Czekasz na swoją turę! </div>
      )}
    </div>
  );
}


export default AnswerQuestion;
