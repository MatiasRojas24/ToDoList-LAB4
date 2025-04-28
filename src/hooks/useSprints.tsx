import { useShallow } from "zustand/shallow"
import { sprintStore } from "../store/sprintStore"
import { ISprint } from "../types/ISprint"
import Swal from "sweetalert2"
import { addTaskToSprintController, createSprintController, deleteSprintController, getSprintsController, updateSprintController } from "../api/sprintController"
import { ITarea } from "../types/ITarea"
import { createTareaController, tareaFromSprintToBacklog, updateTareaController } from "../api/taskController"


export const useSprints = () => {
    const { sprints, setSprints, agregarNuevaSprint, editarUnaSprint, eliminarUnaSprint } = sprintStore(useShallow((state) => ({
        sprints: state.sprints,
        setSprints: state.setSprints,
        agregarNuevaSprint: state.agregarNuevaSprint,
        editarUnaSprint: state.editarUnaSprint,
        eliminarUnaSprint: state.eliminarUnaSprint,
    })))

    const getSprints = async () => {
        const data = await getSprintsController()
        if (data) {
            const sprintsFormateadas = data.map((sprint: ISprint) => ({
                ...sprint,
                fechaCierre: sprint.fechaCierre ?
                    new Date(sprint.fechaCierre).toISOString().split("T")[0]
                    : "",
                fechaInicio: sprint.fechaInicio ?
                    new Date(sprint.fechaInicio).toISOString().split("T")[0]
                    : "",
            }));
            setSprints(sprintsFormateadas)
        }
    }
    const crearSprint = async (nuevaSprint: ISprint) => {
        agregarNuevaSprint(nuevaSprint)
        try {
            await createSprintController(nuevaSprint)
            Swal.fire("Éxito", "Sprint creada correctamente", "success")
        } catch (error) {
            eliminarUnaSprint(nuevaSprint._id!)
            console.error("Algo salió mal al crear la sprint: ", error)
        }
    }

    const putSprintEditar = async (sprintEditada: ISprint) => {
        const estadoPrevio = sprints.find((el) => el._id === sprintEditada._id)
        editarUnaSprint(sprintEditada)
        try {
            await updateSprintController(sprintEditada)
            Swal.fire("Éxito", "Sprint actualizada correctamente", "success")
        } catch (error) {
            if (estadoPrevio) editarUnaSprint(estadoPrevio)
            console.error("Algo salió mal al editar la sprint", error)
        }
    }

    const eliminarSprint = async (idSprint: string) => {
        const estadoPrevio = sprints.find((el) => el._id === idSprint)
        const confirm = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        })
        if (!confirm.isConfirmed) return
        eliminarUnaSprint(idSprint)
        try {
            await deleteSprintController(idSprint)
            Swal.fire("Eliminado", "La sprint se eliminó correctamente", "success")
        } catch (error) {
            if (estadoPrevio) agregarNuevaSprint(estadoPrevio)
            console.error("Algo salió mal al eliminar la tarea: ", error)
        }
    }

    const crearTareaSprint = async (nuevaTarea: ITarea, sprintId: string) => {
        try {
            await createTareaController(nuevaTarea)
            await addTaskToSprintController(nuevaTarea._id!, sprintId)
            Swal.fire("Éxito", "Tarea creada correctamente", "success")
        } catch (error) {
            console.error("Algo salió mal al crear la tarea: ", error)
        }
    }

    const editarEstadoTareaSprint = async (tareaEditada: ITarea) => {
        try {
            await updateTareaController(tareaEditada)
        } catch (error) {
            console.error("Algo salió mal al editar el estado de la tarea: ", error)
        }
    }

    const enviarTareaABacklog = async (tareaId: string, sprintId: string) => {
        try {
            await tareaFromSprintToBacklog(tareaId, sprintId)
            Swal.fire("Éxito", "Tarea enviada al backlog correctamente", "success")
        } catch (error) {
            console.error("Algo salió mal al enviar la tarea al backlog: ", error)
        }
    }

    return { getSprints, crearSprint, putSprintEditar, eliminarSprint, crearTareaSprint, editarEstadoTareaSprint, enviarTareaABacklog, sprints }
}