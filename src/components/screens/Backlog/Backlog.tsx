import { useEffect, useState } from "react";
import { useTareas } from "../../../hooks/useTareas";
import { tareaStore } from "../../../store/tareaStore";
import styles from "./Backlog.module.css";
import { TareaBacklogCard } from "../../UI/TareaBacklogCard/TareaBacklogCard";
import { ITarea } from "../../../types/ITarea";
import { ModalCrearTarea } from "../../UI/ModalCrearTarea/ModalCrearTarea";
import { useSprints } from "../../../hooks/useSprints";

export const Backlog = () => {
  const setTareaActiva = tareaStore((state) => state.setTareaActiva)

  const { getTareas, tareas, eliminarTarea } = useTareas()
  useEffect(() => {
    getTareas()
  }, [])

  const [openModalTarea, setOpenModalTarea] = useState(false)

  const handleOpenModalEdit = (tarea: ITarea) => {
    setTareaActiva(tarea)
    setOpenModalTarea(true)
  }
  const handleCloseModal = () => {
    setOpenModalTarea(false)
  }
  const handleDeleteTarea = (idTarea: string) => {
    eliminarTarea(idTarea)
  }

  // Enviar tarea a sprint
  const { getSprints, sprints } = useSprints()
  useEffect(() => {
    getSprints()
  }, [])
  const { recibirTareaDeBacklog } = useSprints()
  const { enviarTareaASprint } = useTareas()
  const handleEnviarTareaASprint = (tareaAEnviar: ITarea, idSprint: string) => {
    const sprintAEnviar = sprints.find((sprint) => sprint.id == idSprint)
    if (!sprintAEnviar) return;
    const tareasActualizadas = [...sprintAEnviar?.tareas, tareaAEnviar]

    enviarTareaASprint(tareaAEnviar.id!)
    recibirTareaDeBacklog({ ...sprintAEnviar!, tareas: tareasActualizadas });
  }
  return (
    <>
      <div className={styles.containerBacklog}>
        <h1>Backlog</h1>
        <button className={styles.crearTareaButton} onClick={() => setOpenModalTarea(true)}>
          Crear Tarea
          <span className={`material-symbols-outlined ${styles.backlogIcon}`}>
            playlist_add
          </span>
        </button>

        {
          tareas?.length > 0 ?
            tareas.map((el) => (
              <TareaBacklogCard key={el.id} tarea={el} handleOpenModalEdit={handleOpenModalEdit} handleDeleteTarea={handleDeleteTarea} handleEnviarTareaASprint={handleEnviarTareaASprint} />
            )) : <div>
              <h3 style={{ marginLeft: "20px", marginTop: "10px" }}>No hay Tareas</h3>
            </div>
        }
      </div>
      {openModalTarea && <ModalCrearTarea handleCloseModal={handleCloseModal} />}
    </>
  );
};
