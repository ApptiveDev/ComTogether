import { useState } from "react";
import CompatibilityCheckModal from "@/components/common/CompatibilityCheckModal/CompatibilityCheckModal";
import CompatibilityCheckLayout from "@/components/layout/CompabilityCheckLayout";

export default function CompatibilityCheck() {
  return(
    <CompatibilityCheckLayout/>
  )
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // return (
  //   <div>
  //     <button onClick={() => setIsModalOpen(true)}>호환성 검사 시작</button>
  //     <CompatibilityCheckModal
  //       isOpen={isModalOpen}
  //       onClose={() => setIsModalOpen(false)}
  //     />
  //   </div>
  // );
}
