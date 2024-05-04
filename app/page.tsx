'use client'
import { Experience } from '@/components/Experience'
import { insertCoin } from "playroomkit";
import { useEffect, useState } from 'react';

export default function Home() {

  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    const joinPlayRoom = async () => {
      try {
        await insertCoin(
          {
            skipLobby:true
          }
        )
        setIsJoined(true)
      } catch (error) {
        console.log('Join Error: ', error)
      }
    }
    joinPlayRoom()
  }, [])

  return (
    <div style={{ width: "100vw", height: "100vh" }}>

      {
        isJoined && <Experience />
      }

    </div>
  );
}
