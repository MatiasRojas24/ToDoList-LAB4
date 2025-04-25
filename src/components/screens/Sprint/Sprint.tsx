import { useEffect, useState } from "react";
import { useSprints } from "../../../hooks/useSprints";
import styles from "./Sprint.module.css";
import { ISprint } from "../../../types/ISprint";
import { useSearchParams } from "react-router-dom";
import { ITarea } from "../../../types/ITarea";
import { TarjetaTareaSprint } from "../../UI/tarjetaTareaSprint/TarjetaTareaSprint";
import { ModalCrearTareaSprint } from "../../UI/ModalCrearTareaSprint/ModalCrearTareaSprint";
import { tareaStore } from "../../../store/tareaStore";
import { ModalViewTarea } from "../../UI/ModalViewTarea/ModalViewTarea";
import { useTareas } from "../../../hooks/useTareas";

export const Sprint = () => {
  const [searchParams] = useSearchParams()
  const { getSprints, sprints } = useSprints()
  const [sprintUrlId, setSprintUrlId] = useState("")

  useEffect(() => {
    const url = searchParams.get("sprint");
    if (url) setSprintUrlId(url);
  }, [searchParams]);
  useEffect(() => {
    getSprints();
  }, []);
  useEffect(() => {
    if (sprints.length > 0 && sprintUrlId) {
      handleGetTareas();
    }
  }, [sprints, sprintUrlId]);

  const [sprint, setSprint] = useState<ISprint>()
  const handleGetTareas = () => {
    const sprintURL = sprints.find((sprint) => sprint.id === sprintUrlId);
    if (!sprintURL) {
      setSprint(undefined);
      setTareasPendiente([]);
      setTareasEnProgreso([]);
      setTareasCompletadas([]);
      return;
    }
    setSprint(sprintURL);
    const tareas = sprintURL.tareas || [];
    sortTareas(tareas);
  };

  const [tareasPendiente, setTareasPendiente] = useState<ITarea[]>([])
  const [tareasEnProgreso, setTareasEnProgreso] = useState<ITarea[]>([])
  const [tareasCompletadas, setTareasCompletadas] = useState<ITarea[]>([])
  const sortTareas = (tareas: ITarea[]) => {
    const pendientes = tareas.filter(tarea => tarea.estado === 'pendiente');
    const enProgreso = tareas.filter(tarea => tarea.estado === 'en progreso');
    const completadas = tareas.filter(tarea => tarea.estado === 'completado');

    setTareasPendiente(pendientes);
    setTareasEnProgreso(enProgreso);
    setTareasCompletadas(completadas);
  }

  // editar estado de las tareas de la sprint
  const { modificarEstadoTareasSprint } = useSprints()
  const handleChangeEstadoAPendiente = (tarea: ITarea) => {
    const tareaActualizada: ITarea = { ...tarea, estado: 'pendiente' }
    handleUpdateTarea(tareaActualizada)
  };
  const handleChangeEstadoAEnProgreso = (tarea: ITarea) => {
    const tareaActualizada: ITarea = { ...tarea, estado: 'en progreso' }
    handleUpdateTarea(tareaActualizada)
  }
  const handleChangeEstadoACompletado = (tarea: ITarea) => {
    const tareaActualizada: ITarea = { ...tarea, estado: 'completado' }
    handleUpdateTarea(tareaActualizada)
  }
  const handleUpdateTarea = (tareaActualizada: ITarea) => { //sube la actualización de las tareas a la sprint
    const tareasActualizadas = sprint?.tareas.map((tarea) =>
      tarea.id === tareaActualizada.id ? tareaActualizada : tarea
    );
    if (!tareasActualizadas) return;
    modificarEstadoTareasSprint({ ...sprint!, tareas: tareasActualizadas });
  }

  // Abrir modal crear tarea
  const [isOpenModal, setIsOpenModal] = useState(false)
  const handleCloseModal = () => {
    setIsOpenModal(false)
  }
  const setTareaActiva = tareaStore((state) => state.setTareaActiva)
  const handleOpenEditModal = (tarea: ITarea) => {
    setTareaActiva(tarea)
    setIsOpenModal(true)
  }
  // Crear Tarea 
  const { crearTareaSprint } = useSprints()
  const handleCrearTareaEnSprint = (nuevaTarea: ITarea) => {
    if (!sprint) return;
    const tareasActualizadas = [...sprint.tareas, nuevaTarea];
    crearTareaSprint({ ...sprint, tareas: tareasActualizadas });
  }

  // Editar Tarea
  const { editarTareasSprint } = useSprints()
  const handleEditarTareaSprint = (tareaEditada: ITarea) => {
    if (!sprint) return;
    const tareasActualizadas = sprint.tareas.map((tarea) =>
      tarea.id === tareaEditada.id ? tareaEditada : tarea
    );
    editarTareasSprint({ ...sprint, tareas: tareasActualizadas });
  }

  // Eliminar tarea
  const { eliminarTareaSprint } = useSprints()
  const handleEliminarTarea = (idTarea: string) => {
    if (!sprint) return;
    const tareasActualizadas = sprint.tareas.filter(tarea => tarea.id !== idTarea);
    eliminarTareaSprint({ ...sprint, tareas: tareasActualizadas });
  };

  // Ver tarea
  const [isOpenViewModal, setIsOpenViewModal] = useState(false)
  const [tareaView, setTareaView] = useState<ITarea>()
  const handleOpenViewModal = (tarea: ITarea) => {
    setIsOpenViewModal(true)
    setTareaView(tarea)
  }

  // Enviar tarea al backlog
  const { recibirTareaDeSprint } = useTareas()
  const { enviarTareaABacklog } = useSprints()
  const handleEnviarABacklog = (tareaIn: ITarea) => {
    if (!sprint) return;
    const tareasActualizadas = sprint.tareas.filter(tarea => tarea.id !== tareaIn.id);
    enviarTareaABacklog({ ...sprint, tareas: tareasActualizadas });
    recibirTareaDeSprint(tareaIn)
  }
  return (
    <>
      <div className={styles.containerPrincipal}>
        <div className={styles.containerPrincipalSprints}>
          <h1>{sprint?.nombre}</h1>
          <button className={styles.crearTareaButton} onClick={() => setIsOpenModal(true)}>
            Crear Tarea
            <span className={`material-symbols-outlined ${styles.backlogIcon}`}>
              playlist_add
            </span>
          </button>
          <div className={styles.containerSprintProgress}>
            <div className={styles.sprintProgress}>
              <h2>Pendiente</h2>
              <hr />
              <div className={styles.containerTarjetasSprintProgress}>
                {tareasPendiente.length > 0 && <TarjetaTareaSprint tareas={tareasPendiente} handleChangeEstadoAEnProgreso={handleChangeEstadoAEnProgreso} handleChangeEstadoAPendiente={handleChangeEstadoAPendiente} handleChangeEstadoACompletado={handleChangeEstadoACompletado} handleOpenEditModal={handleOpenEditModal} handleEliminarTarea={handleEliminarTarea} handleOpenViewModal={handleOpenViewModal} handleEnviarABacklog={handleEnviarABacklog} />}
              </div>
            </div>
            <div className={styles.sprintProgress}>
              <h2>En Progreso</h2>
              <hr />
              <div className={styles.containerTarjetasSprintProgress}>
                {tareasEnProgreso.length > 0 && <TarjetaTareaSprint tareas={tareasEnProgreso} handleChangeEstadoAEnProgreso={handleChangeEstadoAEnProgreso} handleChangeEstadoAPendiente={handleChangeEstadoAPendiente} handleChangeEstadoACompletado={handleChangeEstadoACompletado} handleOpenEditModal={handleOpenEditModal} handleEliminarTarea={handleEliminarTarea} handleOpenViewModal={handleOpenViewModal} handleEnviarABacklog={handleEnviarABacklog} />}
              </div>
            </div>
            <div className={styles.sprintProgress}>
              <h2>Completado</h2>
              <hr />
              <div className={styles.containerTarjetasSprintProgress}>
                {tareasCompletadas.length > 0 && <TarjetaTareaSprint tareas={tareasCompletadas} handleChangeEstadoAEnProgreso={handleChangeEstadoAEnProgreso} handleChangeEstadoAPendiente={handleChangeEstadoAPendiente} handleChangeEstadoACompletado={handleChangeEstadoACompletado} handleOpenEditModal={handleOpenEditModal} handleEliminarTarea={handleEliminarTarea} handleOpenViewModal={handleOpenViewModal} handleEnviarABacklog={handleEnviarABacklog} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpenModal && <ModalCrearTareaSprint handleCloseModal={handleCloseModal} crearTareaSprint={handleCrearTareaEnSprint} editarTareaSprint={handleEditarTareaSprint} sprint={sprint!} />}
      {isOpenViewModal && <ModalViewTarea tarea={tareaView!} setOpenViewModal={setIsOpenViewModal} />}
    </>
  );
};