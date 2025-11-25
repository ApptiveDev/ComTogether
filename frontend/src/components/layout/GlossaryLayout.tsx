import { useState } from "react";
import style from "./glossaryLayout.module.css";
import GlossaryModal from "../common/Glossary/GlossaryModal/GlossaryModal";
import GlossaryIcon from "../../assets/image/icon/GlossaryIcon";

export default function GlossaryLayout() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className={style.btnWrapper}>
        <div className={style.modalOpenBtn} onClick={() => setModalOpen(true)}>
          <GlossaryIcon text={"?"} />
        </div>
      </div>
      <GlossaryModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
