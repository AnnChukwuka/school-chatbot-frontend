import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const saveChatMessage = async (
  sessionId: string,
  text: string,
  sender: "user" | "bot"
) => {
  const ref = collection(db, "chats", sessionId, "messages");
  await addDoc(ref, {
    text,
    sender,
    timestamp: serverTimestamp(),
  });
};
