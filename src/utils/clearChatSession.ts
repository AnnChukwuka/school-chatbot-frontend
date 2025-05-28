import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export const clearChatSession = async (sessionId: string) => {
  const ref = collection(db, "chats", sessionId, "messages");
  const snapshot = await getDocs(ref);
  const deletes = snapshot.docs.map((d) =>
    deleteDoc(doc(db, "chats", sessionId, "messages", d.id))
  );
  await Promise.all(deletes);
};
