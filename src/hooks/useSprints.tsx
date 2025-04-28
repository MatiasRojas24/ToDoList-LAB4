import { useShallow } from "zustand/shallow"
import { sprintStore } from "../store/sprintStore"
import { ISprint } from "../types/ISprint"
import Swal from "sweetalert2"
import { getSprintsController } from "../api/sprintController"


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
        if (data) setSprints(data)
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

    const modificarEstadoTareasSprint = async (sprintEditada: ISprint) => {
        const estadoPrevio = sprints.find((el) => el._id === sprintEditada._id)
        editarUnaSprint(sprintEditada)
        try {
            await updateSprintController(sprintEditada)
        } catch (error) {
            if (estadoPrevio) editarUnaSprint(estadoPrevio)
            console.error("Algo salió mal al modificar el estado de las tareas de la sprint", error)
        }
    }

    const editarTareasSprint = async (sprintEditada: ISprint) => {
        const estadoPrevio = sprints.find((el) => el._id === sprintEditada._id)
        try {
            await updateSprintController(sprintEditada)
            editarUnaSprint(sprintEditada)
            Swal.fire("Éxito", "Tarea actualizada correctamente", "success")
        } catch (error) {
            if (estadoPrevio) editarUnaSprint(estadoPrevio)
            console.error("Algo salió mal al editar la tarea de la sprint", error)
        }
    }

    const crearTareaSprint = async (sprintEditada: ISprint) => {
        const estadoPrevio = sprints.find((el) => el._id === sprintEditada._id)
        try {
            await updateSprintController(sprintEditada)
            editarUnaSprint(sprintEditada)
            Swal.fire("Éxito", "Tarea creada correctamente", "success")
        } catch (error) {
            if (estadoPrevio) editarUnaSprint(estadoPrevio)
            console.error("Algo salió mal al crear la tarea de la sprint", error)
        }
    }

    const eliminarTareaSprint = async (sprintEditada: ISprint) => {
        const estadoPrevio = sprints.find((el) => el._id === sprintEditada._id)
        const confirm = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        })
        if (!confirm.isConfirmed) return
        try {
            await updateSprintController(sprintEditada)
            editarUnaSprint(sprintEditada)
            Swal.fire("Eliminado", "La tarea se eliminó correctamente", "success")
        } catch (error) {
            if (estadoPrevio) editarUnaSprint(estadoPrevio)
            console.error("Algo salió mal al eliminar la tarea de la sprint", error)
        }
    }

    const enviarTareaABacklog = async (sprintEditada: ISprint) => {
        const estadoPrevio = sprints.find((el) => el.id === sprintEditada.id)
        try {
            await updateSprintController(sprintEditada)
            editarUnaSprint(sprintEditada)
            Swal.fire("Enviado", "La tarea se envió al backlog correctamente", "success")
        } catch (error) {
            if (estadoPrevio) editarUnaSprint(estadoPrevio)
            console.error("Algo salió mal al enviar la tarea de la sprint al backlog", error)
        }
    }

    const recibirTareaDeBacklog = async (sprintEditada: ISprint) => {
        const estadoPrevio = sprints.find((el) => el.id === sprintEditada.id)
        try {
            await updateSprintController(sprintEditada)
            editarUnaSprint(sprintEditada)
        } catch (error) {
            if (estadoPrevio) editarUnaSprint(estadoPrevio)
            console.error("Algo salió mal al recibir la tarea del backlog", error)
        }
    }

    return { getSprints, crearSprint, putSprintEditar, eliminarSprint, modificarEstadoTareasSprint, editarTareasSprint, crearTareaSprint, eliminarTareaSprint, enviarTareaABacklog, recibirTareaDeBacklog, sprints }
}