import { FC, useState } from "react";
import { ISprint } from "../../../types/ISprint";
import styles from './SprintListCard.module.css'
import { ModalViewSprint } from "../ModalViewSprint/ModalViewSprint";

type ISprintListCard = {
    sprint: ISprint
    handleNavigateSprint: (sprint: ISprint) => void
    handleOpenModalEdit: (sprint: ISprint) => void
    handleDelete: (idSprint: string) => void
}

export const SprintListCard: FC<ISprintListCard> = ({ sprint, handleNavigateSprint, handleOpenModalEdit, handleDelete }) => {
    const [openViewModal, setOpenViewModal] = useState(false)
    return (
        <>
            <div key={sprint._id} onClick={(e) => { e.stopPropagation(); handleNavigateSprint(sprint) }} className={styles.containerSprints}>
                <h4 className={styles.textoTarjeta}>{sprint.nombre}</h4>
                <p>Inicio: {sprint.fechaInicio}</p>
                <p>Cierre: {sprint.fechaCierre}</p>
                <div className={styles.buttons}>
                    <button onClick={(e) => { e.stopPropagation(); setOpenViewModal(true) }} className={styles.visibilityButton}>
                        <span className="material-symbols-outlined">visibility</span>
                    </button>
                    <button className={styles.editButton} onClick={(e) => { e.stopPropagation(); handleOpenModalEdit(sprint) }}>
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className={styles.deleteButton} onClick={(e) => { e.stopPropagation(); handleDelete(sprint._id!) }}>
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
            {openViewModal && <ModalViewSprint sprint={sprint} setOpenViewModal={setOpenViewModal} />}
        </>

    )
}
