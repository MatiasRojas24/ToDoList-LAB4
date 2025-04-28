import { FC, useEffect, useState } from "react";
import { ITarea } from "../../../types/ITarea";
import styles from "./TareaBacklogCard.module.css";
import Dropdown from "../Dropdown/Dropdown";
import { ModalViewTarea } from "../ModalViewTarea/ModalViewTarea";
import { ISprint } from "../../../types/ISprint";
import Swal from "sweetalert2";

type ITareaBacklogCard = {
    tarea: ITarea;
    handleOpenModalEdit: (tarea: ITarea) => void;
    handleDeleteTarea: (idTarea: string) => void;
    handleEnviarTareaASprint: (tarea: ITarea, idSprint: string) => void;
    sprints: ISprint[];
};

export const TareaBacklogCard: FC<ITareaBacklogCard> = ({
    tarea,
    handleOpenModalEdit,
    handleDeleteTarea,
    handleEnviarTareaASprint,
    sprints,
}) => {
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedSprint, setSelectedSprint] = useState("");

    useEffect(() => { }, []);

    const onSelectSprint = (idSprint: string) => {
        setSelectedSprint(idSprint);
    };

    const handleEnviarTarea = async () => {
        if (!selectedSprint) {
            Swal.fire("Error", "Por favor, selecciona un sprint", "error");
            return;
        }
        try {
            await handleEnviarTareaASprint(tarea, selectedSprint);
            Swal.fire("Éxito", "Tarea enviada al sprint correctamente", "success");
            setSelectedSprint("");
        } catch (error) {
            Swal.fire("Error", "No se pudo enviar la tarea al sprint", "error");
        }
    };

    return (
        <>
            <div className={styles.containerTareaBacklog}>
                <p>
                    Título: {tarea.titulo} - Descripción: {tarea.descripcion}
                    <div className={styles.buttons}>
                        <button
                            className={styles.sendButton}
                            onClick={handleEnviarTarea}
                            disabled={!selectedSprint}
                        >
                            Enviar a
                            <span className={`material-symbols-outlined ${styles.sendIcon}`}>
                                send
                            </span>
                        </button>
                        <Dropdown sprints={sprints} onSelectSprint={onSelectSprint} />
                        <button className={styles.visibilityButton}>
                            <span
                                className="material-symbols-outlined"
                                onClick={() => setOpenViewModal(true)}
                            >
                                visibility
                            </span>
                        </button>
                        <button
                            className={styles.editButton}
                            onClick={() => handleOpenModalEdit(tarea)}
                        >
                            <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteTarea(tarea._id!)}
                        >
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </p>
            </div>
            {openViewModal && (
                <ModalViewTarea tarea={tarea} setOpenViewModal={setOpenViewModal} />
            )}
        </>
    );
};