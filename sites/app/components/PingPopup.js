import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001; /* Ensure it covers everything else */
`;

const Popup = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
`;

const CloseButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;

const Terminal = styled.div`
  background-color: black;
  color: white;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  height: 200px;
  overflow-y: auto;
  font-family: monospace;
`;

const PingPopup = ({ address, onClose }) => {
  const [output, setOutput] = useState('');

  useEffect(() => {
    const pingAddress = async () => {
      // Here you would implement your server-side ping logic
      // For demonstration, we will just simulate ping output
      const fakePingOutput = `
Pinging ${address} with 32 bytes of data:
Reply from ${address}: bytes=32 time=14ms TTL=57
Reply from ${address}: bytes=32 time=14ms TTL=57
Reply from ${address}: bytes=32 time=14ms TTL=57
Reply from ${address}: bytes=32 time=14ms TTL=57

Ping statistics for ${address}:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 14ms, Maximum = 14ms, Average = 14ms
      `;
      setOutput(fakePingOutput);
    };

    pingAddress();
  }, [address]);

  return (
    <Overlay>
      <Popup>
        <CloseButton onClick={onClose}>Close</CloseButton>
        <Terminal>
          <pre>{output}</pre>
        </Terminal>
      </Popup>
    </Overlay>
  );
};

export default PingPopup;
