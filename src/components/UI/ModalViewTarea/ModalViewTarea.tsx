import { FC } from 'react'
import styles from './ModalViewTarea.module.css'
import { ITarea } from '../../../types/ITarea'

type IModalViewTarea = {
    tarea: ITarea
    setOpenViewModal: (state: boolean) => void
}

export const ModalViewTarea: FC<IModalViewTarea> = ({ tarea, setOpenViewModal }) => {
    return (
        <div className={styles.containerPrincipalModal}>
            <div className={styles.contentPopUP}>
                <h2 className={styles.textoTarjeta}>Título: {tarea.titulo}</h2>
                <h3 className={styles.textoTarjeta}>Descripción: {tarea.descripcion}</h3>
                <h3>Fecha Límite: {tarea.fechaLimite}</h3>
                <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2rem" }}>
                    <button className={styles.buttonCerrarModal} onClick={() => setOpenViewModal(false)}>Cerrar Tarea</button>
                </div>
            </div>
        </div>
    )
}
