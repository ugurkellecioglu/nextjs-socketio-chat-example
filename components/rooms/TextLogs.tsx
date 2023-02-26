import { FC, useContext } from "react";

import SocketContext from "../contexts/socket/SocketContext";
import { User } from "./User";
import { DateString } from "./DateString";

export const TextLogs: FC = () => {
  const socket = useContext(SocketContext);
  const createALinkFromBlob = (blob: Blob) => {
    console.log("blob", blob);
    // Create a new blob object with the audio data
    const audioBlob = new Blob([blob], { type: "audio/mpeg" });

    // Create a blob URL for the audio
    const audioUrl = URL.createObjectURL(audioBlob);

    // Create a link element with the audio URL
    const downloadLink = document.createElement("a");
    downloadLink.href = audioUrl;
    downloadLink.download = "audio.mp3"; // Set the file name and extension

    // Add the link to the DOM
    document.body.appendChild(downloadLink);

    // Click the link to download the file
    downloadLink.click();

    // Remove the link from the DOM
    document.body.removeChild(downloadLink);
  };

  return (
    <section>
      <style jsx>{`
        span {
          color: #999;
        }
      `}</style>
      <h4>logs</h4>
      <ul>
        {Array.isArray(socket?.textLogs) && socket.textLogs.length > 0 ? (
          socket.textLogs.map((t, i) => (
            <li key={i}>
              {typeof t.message !== "string" ? (
                <a onClick={() => createALinkFromBlob(t.message)}>download</a>
              ) : (
                t.message
              )}{" "}
              <span>
                <User data={socket.roomMembers[t.sender]?.profile} />
                , <DateString time={t.time} />
              </span>
            </li>
          ))
        ) : (
          <li>no text logs found</li>
        )}
      </ul>
    </section>
  );
};
