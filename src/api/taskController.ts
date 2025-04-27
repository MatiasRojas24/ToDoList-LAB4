import axios from "axios"
import { ITarea } from "../types/ITarea"
import { ISprint } from "../types/ISprint"
import { IBacklog } from "../types/IBacklog"

const API_URL = import.meta.env.VITE_API_URL_TASKS!

export const getTareasController = async (): Promise<ITarea[] | undefined> => {
    try {
        const response = await axios.get<ITarea[]>(API_URL)
        return response.data
    } catch (error) {
        console.log("Problemas en getTareasController", error)
    }
}

export const getTareaByIdController = async (id: string): Promise<ITarea | undefined> => {
    try {
        const response = await axios.get<ITarea>(API_URL + `/${id}`)
        return response.data
    } catch (error) {
        console.log("Problemas en getTareaByIdController", error)
    }
}

export const createTareaController = async (nuevaTarea: ITarea): Promise<ITarea | undefined> => {
    try {
        const response = await axios.post<ITarea>(API_URL, nuevaTarea)
        return response.data
    } catch (error) {
        console.log("Problemas con createTareaController", error)
    }
}

export const updateTareaController = async (tareaActualizada: ITarea): Promise<ITarea | undefined> => {
    try {
        const response = await axios.put<ITarea>(API_URL + `/${tareaActualizada.id}`, tareaActualizada)
        return response.data
    } catch (error) {
        console.log("Problemas en updateTareaController", error)
    }
}

export const deleteTareaController = async (id: string): Promise<{ mensaje: string } | undefined> => {
    try {
        const response = await axios.delete<{ mensaje: string }>(API_URL + `/${id}`)
        return response.data
    } catch (error) {
        console.log("Problemas en deleteTareaController", error)
    }
}

export const tareaFromBacklogToSprintController = async (tareaId: string, sprintId: string): Promise<{ mensaje: string, sprint: ISprint } | undefined> => {
    try {
        const response = await axios.put<{ mensaje: string, sprint: ISprint }>(API_URL + `${tareaId}/move-to-sprint/${sprintId}`)
        return response.data
    } catch (error) {
        console.log("Problemas en tareaFromBacklogToSprintController", error)
    }
}

export const tareaFromSprintToBacklog = async (tareaId: string, sprintId: string): Promise<{ mensaje: string, backlog: IBacklog } | undefined> => {
    try {
        const response = await axios.put<{ mensaje: string, backlog: IBacklog }>(API_URL + `${tareaId}/move-to-backlog/${sprintId}`)
        return response.data
    } catch (error) {
        console.log("Problemas en tareaFromSprintToBacklog", error)
    }
}