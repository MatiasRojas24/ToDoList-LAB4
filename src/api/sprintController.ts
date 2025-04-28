import axios from "axios";
import { ISprint } from "../types/ISprint";

const API_URL = import.meta.env.VITE_API_URL_SPRINTS!

export const getSprintsController = async (): Promise<ISprint[] | undefined> => {
    try {
        const response = await axios.get<ISprint[]>(API_URL)
        return response.data
    } catch (error) {
        console.log("Problemas en getSprintsController", error)
    }
}

export const getSprintByIdController = async (sprintId: string): Promise<ISprint | undefined> => {
    try {
        const response = await axios.get<ISprint>(API_URL + `/${sprintId}`)
        return response.data
    } catch (error) {
        console.log("Problemas en getSprintByIdController", error)
    }
}

export const createSprintController = async (sprintNueva: ISprint): Promise<ISprint | undefined> => {
    try {
        const response = await axios.post<ISprint>(API_URL, sprintNueva)
        return response.data
    } catch (error) {
        console.log("Problemas en createSprintController", error)
    }
}

export const updateSprintController = async (sprintActualizada: ISprint): Promise<ISprint | undefined> => {
    try {
        const response = await axios.put<ISprint>(API_URL + `/${sprintActualizada._id}`, sprintActualizada)
        return response.data
    } catch (error) {
        console.log("Problemas en updateSprintController", error)
    }
}

export const deleteSprintController = async (sprintId: string): Promise<{ mensaje: string } | undefined> => {
    try {
        const response = await axios.delete<{ mensaje: string }>(API_URL + `/${sprintId}`)
        return response.data
    } catch (error) {
        console.log("Problemas en deleteSprintController", error)
    }
}

export const addTaskToSprintController = async (tareaId: string, sprintId: string): Promise<{ mensaje: string, sprint: ISprint } | undefined> => {
    try {
        const response = await axios.put<{ mensaje: string, sprint: ISprint }>(API_URL + `/${sprintId}/add-task/${tareaId}`)
        return response.data
    } catch (error) {
        console.log("Problemas en addTaskToSprintController", error)
    }
}