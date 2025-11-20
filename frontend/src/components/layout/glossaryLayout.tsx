import { useState } from "react";
import style from "./glossaryLayout.module.css";
import GlossaryModal from "../common/glossary/glossaryModal/GlossaryModal";
import ChatBotIcon from "../../assets/image/icon/ChatBotIcon";

export default function GlossaryLayout() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className={style.btnWrapper}>
        <div className={style.modalOpenBtn} onClick={() => setModalOpen(true)}>
          <ChatBotIcon text={"?"} />
        </div>
      </div>
      <GlossaryModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
