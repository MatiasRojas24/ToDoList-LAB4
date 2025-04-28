import { FC } from 'react'
import { ITarea } from '../../../types/ITarea'
import styles from './TarjetaTareaSprint.module.css'

type ITarjetaTareaSprint = {
    tareas: ITarea[]
    handleChangeEstadoAPendiente: (tarea: ITarea) => void;
    handleChangeEstadoAEnProgreso: (tarea: ITarea) => void;
    handleChangeEstadoACompletado: (tarea: ITarea) => void;
    handleOpenEditModal: (tarea: ITarea) => void;
    handleEliminarTarea: (idTarea: string) => void;
    handleOpenViewModal: (tarea: ITarea) => void;
    handleEnviarABacklog: (tarea: ITarea) => void;
}
export const TarjetaTareaSprint: FC<ITarjetaTareaSprint> = ({ tareas, handleChangeEstadoAPendiente, handleChangeEstadoAEnProgreso, handleChangeEstadoACompletado, handleOpenEditModal, handleEliminarTarea, handleOpenViewModal, handleEnviarABacklog }) => {

    return (
        <>
            {tareas.map((tarea) => (
                <div className={styles.targetSprintProgress}>
                    <h4 className={styles.textoTarjeta}>Título: {tarea.titulo}</h4>
                    <p className={styles.textoTarjeta}>Descripción: {tarea.descripcion}</p>
                    <p className={styles.textoTarjeta}>Fecha Límite: {tarea.fechaLimite}</p>
                    <div className={styles.targetProgressbuttons}>
                        <button className={styles.enviarBacklogButton} onClick={() => handleEnviarABacklog(tarea)}>
                            <span className="material-symbols-outlined">
                                file_export
                            </span>
                        </button>
                        {
                            tarea.estado == 'pendiente' ?
                                <button className={styles.moveButton} onClick={() => handleChangeEstadoAEnProgreso(tarea)}>
                                    <span className="material-symbols-outlined">
                                        double_arrow
                                    </span>
                                </button>
                                :
                                tarea.estado == 'en progreso' ?
                                    <>
                                        <button className={styles.moveButtonIzquierda} onClick={() => handleChangeEstadoAPendiente(tarea)}>
                                            <span className="material-symbols-outlined">
                                                double_arrow
                                            </span>
                                        </button>
                                        <button className={styles.moveButton} onClick={() => handleChangeEstadoACompletado(tarea)}>
                                            <span className="material-symbols-outlined">
                                                double_arrow
                                            </span>
                                        </button>
                                    </>
                                    :
                                    tarea.estado == 'completado' ?
                                        <button className={styles.moveButtonIzquierda} onClick={() => handleChangeEstadoAEnProgreso(tarea)}>
                                            <span className="material-symbols-outlined">
                                                double_arrow
                                            </span>
                                        </button>
                                        : <div></div>
                        }
                        <button className={styles.visibilityButton} onClick={() => { handleOpenViewModal(tarea) }} >
                            <span className="material-symbols-outlined">visibility</span>
                        </button>
                        <button className={styles.editButton} onClick={() => { handleOpenEditModal(tarea) }}>
                            <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button className={styles.deleteButton} onClick={() => { handleEliminarTarea(tarea._id!) }}>
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </div>
            ))}
        </>
    )
}
