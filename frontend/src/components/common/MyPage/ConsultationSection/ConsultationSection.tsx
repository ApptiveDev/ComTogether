import styles from "./ConsultationSection.module.css";
import ConsultationCard from "./ConsultationCard";
import { consultationMock } from "./mock";

export default function ConsultationSection() {
  const visibleConsultations = consultationMock.slice(0, 2);

  return (
    <div className={styles.section}>
      {visibleConsultations.map((item) => (
        <ConsultationCard key={item.id} data={item} />
      ))}
    </div>
  );
}
