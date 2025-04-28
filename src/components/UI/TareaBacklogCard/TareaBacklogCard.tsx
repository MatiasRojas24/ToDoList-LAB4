import { FC, useEffect, useState } from "react";
import { ITarea } from "../../../types/ITarea";
import styles from './TareaBacklogCard.module.css'
import Dropdown from "../Dropdown/Dropdown";
import { ModalViewTarea } from "../ModalViewTarea/ModalViewTarea";
import { ISprint } from "../../../types/ISprint";
import { sprintStore } from "../../../store/sprintStore";
import { useSprints } from "../../../hooks/useSprints";

type ITareaBacklogCard = {
    tarea: ITarea
    handleOpenModalEdit: (tarea: ITarea) => void
    handleDeleteTarea: (idTarea: string) => void
    handleEnviarTareaASprint: (tarea: ITarea, idSprint: string) => void
}

export const TareaBacklogCard: FC<ITareaBacklogCard> = ({ tarea, handleOpenModalEdit, handleDeleteTarea, handleEnviarTareaASprint }) => {
    const [openViewModal, setOpenViewModal] = useState(false)
    const { getSprints, sprints } = useSprints()
    const [selectedSprint, setSelectedSprint] = useState("")
    useEffect(() => {
        getSprints()
    }, [])
    const onSelectSprint = (idSprint: string) => {
        setSelectedSprint(idSprint)
    }
    const handleEnviarTarea = () => {
        if (selectedSprint.length > 0) handleEnviarTareaASprint(tarea, selectedSprint)
    }


    return (
        <>
            <div className={styles.containerTareaBacklog}>
                <p>
                    Título: {tarea.titulo} - Descripción: {tarea.descripcion}
                    <div className={styles.buttons}>
                        <button className={styles.sendButton} onClick={handleEnviarTarea}>
                            Enviar a
                            <span className={`material-symbols-outlined ${styles.sendIcon}`}>
                                send
                            </span>
                        </button>
                        <Dropdown sprints={sprints} onSelectSprint={onSelectSprint} />
                        <button className={styles.visibilityButton}>
                            <span className="material-symbols-outlined" onClick={() => setOpenViewModal(true)}>visibility</span>
                        </button>
                        <button className={styles.editButton} onClick={() => handleOpenModalEdit(tarea)}>
                            <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button className={styles.deleteButton} onClick={() => handleDeleteTarea(tarea._id!)}>
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </p>
            </div>
            {openViewModal && <ModalViewTarea tarea={tarea} setOpenViewModal={setOpenViewModal} />}
        </>
    )
}
