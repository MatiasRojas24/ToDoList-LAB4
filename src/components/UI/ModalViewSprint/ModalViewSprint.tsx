import { FC } from 'react'
import styles from './ModalViewSprint.module.css'
import { ISprint } from '../../../types/ISprint'

type IModalViewSprint = {
    sprint: ISprint
    setOpenViewModal: (state: boolean) => void
}

export const ModalViewSprint: FC<IModalViewSprint> = ({ sprint, setOpenViewModal }) => {
    return (
        <div className={styles.containerPrincipalModal}>
            <div className={styles.contentPopUP}>
                <h2 className={styles.textoTarjeta}>Nombre de la sprint: {sprint.nombre}</h2>
                <h3>Fecha de inicio: {sprint.fechaInicio}</h3>
                <h3>Fecha de cierre: {sprint.fechaCierre}</h3>
                <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2rem" }}>
                    <button className={styles.buttonCerrarModal} onClick={() => setOpenViewModal(false)}>Cerrar Sprint</button>
                </div>
            </div>
        </div>
    )
}
