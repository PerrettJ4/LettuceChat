import Chat from "./Chat";

export default function ChatPage({ params }) {
  const { id } = params;

  console.log("Server component params.id:", id); // Debug: should log correct id

  return <Chat id={id} />;
}
