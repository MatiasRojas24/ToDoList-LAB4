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
import { getSprintByIdController } from "../../../api/sprintController";

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
  const handleGetTareas = async () => {
    const sprintURL = await getSprintByIdController(sprintUrlId);
    if (!sprintURL) {
      setSprint(undefined);
      setTareasPendiente([]);
      setTareasEnProgreso([]);
      setTareasCompletadas([]);
      return;
    }
    sprintURL.tareas = sprintURL.tareas.map((tarea: ITarea) => ({
      ...tarea,
      fechaLimite: tarea.fechaLimite
        ? new Date(tarea.fechaLimite).toISOString().split("T")[0]
        : "",
    }));
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
  const { editarEstadoTareaSprint } = useSprints()
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
  const handleUpdateTarea = (tareaActualizada: ITarea) => {
    editarEstadoTareaSprint(tareaActualizada);
    handleGetTareas()
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
  const handleCrearTareaEnSprint = async (nuevaTarea: ITarea) => {
    await crearTareaSprint(nuevaTarea, sprint!._id!)
    handleGetTareas()
  }

  // Editar Tarea
  const { putTareaEditar } = useTareas()
  const handleEditarTareaSprint = async (tareaEditada: ITarea) => {
    await putTareaEditar(tareaEditada);
    handleGetTareas()
  }

  // Eliminar tarea
  const { eliminarTarea } = useTareas()
  const handleEliminarTarea = async (idTarea: string) => {
    await eliminarTarea(idTarea);
    handleGetTareas()
  };

  // Ver tarea
  const [isOpenViewModal, setIsOpenViewModal] = useState(false)
  const [tareaView, setTareaView] = useState<ITarea>()
  const handleOpenViewModal = (tarea: ITarea) => {
    setIsOpenViewModal(true)
    setTareaView(tarea)
  }

  // Enviar tarea al backlog
  const { enviarTareaABacklog } = useSprints()
  const handleEnviarABacklog = async (tareaIn: ITarea) => {
    await enviarTareaABacklog(tareaIn._id!, sprint!._id!);
    handleGetTareas()
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