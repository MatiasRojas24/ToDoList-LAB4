import { useEffect, useState } from "react";
import { useTareas } from "../../../hooks/useTareas";
import { tareaStore } from "../../../store/tareaStore";
import styles from "./Backlog.module.css";
import { TareaBacklogCard } from "../../UI/TareaBacklogCard/TareaBacklogCard";
import { ITarea } from "../../../types/ITarea";
import { ModalCrearTarea } from "../../UI/ModalCrearTarea/ModalCrearTarea";
import { useSprints } from "../../../hooks/useSprints";
import { tareaFromBacklogToSprintController } from "../../../api/taskController";

export const Backlog = () => {
  const setTareaActiva = tareaStore((state) => state.setTareaActiva);

  const { getTareasBacklog, tareas, eliminarTarea } = useTareas();
  useEffect(() => {
    getTareasBacklog();
  }, [tareas]);

  const [openModalTarea, setOpenModalTarea] = useState(false);

  const handleOpenModalEdit = (tarea: ITarea) => {
    setTareaActiva(tarea);
    setOpenModalTarea(true);
  };
  const handleCloseModal = () => {
    setOpenModalTarea(false);
    setTareaActiva(null);
  };
  const handleDeleteTarea = (idTarea: string) => {
    eliminarTarea(idTarea);
  };

  const { getSprints, sprints } = useSprints();
  useEffect(() => {
    getSprints();
  }, []);

  const handleEnviarTareaASprint = async (
    tareaAEnviar: ITarea,
    idSprint: string
  ) => {
    try {
      const response = await tareaFromBacklogToSprintController(
        tareaAEnviar._id!,
        idSprint
      );
      if (!response) throw new Error("No se pudo mover la tarea");
      eliminarTarea(tareaAEnviar._id!);
    } catch (error) {
      console.error("Error al enviar tarea al sprint:", error);
    }
  };

  return (
    <>
      <div className={styles.containerBacklog}>
        <h1>Backlog</h1>
        <button
          className={styles.crearTareaButton}
          onClick={() => setOpenModalTarea(true)}
        >
          Crear Tarea
          <span className={`material-symbols-outlined ${styles.backlogIcon}`}>
            playlist_add
          </span>
        </button>

        {tareas?.length > 0 ? (
          tareas.map((el) => (
            <TareaBacklogCard
              key={el._id}
              tarea={el}
              handleOpenModalEdit={handleOpenModalEdit}
              handleDeleteTarea={handleDeleteTarea}
              handleEnviarTareaASprint={handleEnviarTareaASprint}
              sprints={sprints}
            />
          ))
        ) : (
          <div>
            <h3 style={{ marginLeft: "20px", marginTop: "10px" }}>
              No hay Tareas
            </h3>
          </div>
        )}
      </div>
      {openModalTarea && (
        <ModalCrearTarea handleCloseModal={handleCloseModal} />
      )}
    </>
  );
};