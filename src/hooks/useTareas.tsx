import { useShallow } from "zustand/shallow";
import { tareaStore } from "../store/tareaStore";
import { ITarea } from "../types/ITarea";
import Swal from "sweetalert2";
import {
    getBacklogController,
    addTaskToBacklogController,
} from "../api/backlogController";
import {
    createTareaController,
    updateTareaController,
    deleteTareaController,
    tareaFromBacklogToSprintController,
} from "../api/taskController";

export const useTareas = () => {
    const {
        tareas,
        setTareas,
        agregarNuevaTarea,
        editarUnaTarea,
        eliminarUnaTarea,
    } = tareaStore(
        useShallow((state) => ({
            tareas: state.tareas,
            setTareas: state.setTareas,
            agregarNuevaTarea: state.agregarNuevaTarea,
            eliminarUnaTarea: state.eliminarUnaTarea,
            editarUnaTarea: state.editarUnaTarea,
        }))
    );

    const getTareasBacklog = async () => {
        const data = await getBacklogController();
        if (data) {
            const tareasFormateadas = data.tareas.map((tarea: ITarea) => ({
                ...tarea,
                fechaLimite: tarea.fechaLimite
                    ? new Date(tarea.fechaLimite).toISOString().split("T")[0]
                    : "",
            }));
            setTareas(tareasFormateadas);
        }
    };

    const crearTarea = async (nuevaTarea: ITarea) => {
        try {
            const tareaCreada = await createTareaController(nuevaTarea);
            if (!tareaCreada) throw new Error("No se pudo crear la tarea");

            const response = await addTaskToBacklogController(tareaCreada._id!);
            if (!response) throw new Error("No se pudo agregar la tarea al backlog");

            agregarNuevaTarea(tareaCreada);
            Swal.fire(
                "Éxito",
                "Tarea creada y agregada al backlog correctamente",
                "success"
            );
        } catch (error) {
            console.error("Algo salió mal al crear la tarea: ", error);
            Swal.fire("Error", "No se pudo crear la tarea", "error");
        }
    };

    const putTareaEditar = async (tareaEditada: ITarea) => {
        const estadoPrevio = tareas.find((el) => el._id === tareaEditada._id);
        editarUnaTarea(tareaEditada);
        try {
            await updateTareaController(tareaEditada);
            Swal.fire("Éxito", "Tarea actualizada correctamente", "success");
        } catch (error) {
            if (estadoPrevio) editarUnaTarea(estadoPrevio);
            console.error("Algo salió mal al editar la tarea: ", error);
            Swal.fire("Error", "No se pudo editar la tarea", "error");
        }
    };

    const eliminarTarea = async (
        idTarea: string,
        isMoveToSprint: boolean = false
    ) => {
        const estadoPrevio = tareas.find((el) => el._id === idTarea);
        if (!isMoveToSprint) {
            const confirm = await Swal.fire({
                title: "¿Estás seguro?",
                text: "Esta acción no se puede deshacer",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });
            if (!confirm.isConfirmed) return;
        }
        eliminarUnaTarea(idTarea);
        try {
            await deleteTareaController(idTarea);
            if (!isMoveToSprint) {
                Swal.fire("Eliminado", "La tarea se eliminó correctamente", "success");
            }
        } catch (error) {
            if (estadoPrevio) agregarNuevaTarea(estadoPrevio);
            console.error("Algo salió mal al eliminar la tarea: ", error);
            if (!isMoveToSprint) {
                Swal.fire("Error", "No se pudo eliminar la tarea", "error");
            }
        }
    };

    const enviarTareaASprint = async (idTarea: string, sprintId: string) => {
        const estadoPrevio = tareas.find((el) => el._id === idTarea);
        try {
            const response = await tareaFromBacklogToSprintController(
                idTarea,
                sprintId
            );
            if (!response) throw new Error("No se pudo mover la tarea");
            eliminarUnaTarea(idTarea);
            Swal.fire(
                "Enviado",
                "La tarea se envió al sprint correctamente",
                "success"
            );
        } catch (error) {
            if (estadoPrevio) agregarNuevaTarea(estadoPrevio);
            console.error("Algo salió mal al enviar la tarea al sprint: ", error);
            Swal.fire("Error", "No se pudo enviar la tarea al sprint", "error");
        }
    };

    return {
        getTareasBacklog,
        crearTarea,
        putTareaEditar,
        eliminarTarea,
        enviarTareaASprint,
        tareas,
    };
};