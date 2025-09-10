import { useState } from "react";
import style from "./chatBotLayout.module.css";
import ChatBotModal from "../common/chatBot/chatBotModal/chatBotModal";
import ChatBotIcon from "../../assets/image/icon/chatBotIcon";

export default function ChatBotLayout() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className={style.btnWrapper}>
        <div className={style.modalOpenBtn} onClick={() => setModalOpen(true)}>
          <ChatBotIcon text={"?"} />
        </div>
      </div>
      <ChatBotModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
