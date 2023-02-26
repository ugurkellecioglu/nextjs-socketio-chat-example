import {
  FC,
  useContext,
  useCallback,
  ChangeEvent,
  useState,
  FormEvent,
} from "react";

import SocketContext from "../contexts/socket/SocketContext";

export const SendTextForm: FC = () => {
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState<string>("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  /**
   * say something
   */
  const handleText = useCallback(() => {
    if (!socket || message.length <= 0) {
      return;
    }
    socket.text(message);
    setMessage("");
  }, [socket, message]);

  /**
   * handle form submission (call text)
   */
  const handleSubmit = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      handleText();
    },
    [handleText]
  );

  /**
   * update text field
   */
  const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setMessage(ev.target.value);
  }, []);

  const handleRecord = useCallback(() => {
    if (!socket) {
      return;
    }
    const constraints = { audio: true };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      setMediaRecorder(mediaRecorder);
      mediaRecorder.start();

      const audioChunks = [];
      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
        // send audio blob to server
        socket.audio(audioBlob);
      });
    });
  }, [socket]);

  const handleStop = useCallback(() => {
    if (!mediaRecorder) {
      return;
    }
    mediaRecorder.stop();
  }, [mediaRecorder]);

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleChange} value={message} />
      <button onClick={handleText}>say</button>
      <button onClick={handleRecord}>record</button>
      <button onClick={handleStop}>stop</button>
    </form>
  );
};
