import axios from "axios";
import { IBacklog } from "../types/IBacklog";

const API_URL = import.meta.env.VITE_API_URL_BACKLOG!

export const getBacklogController = async (): Promise<IBacklog | undefined> => {
    try {
        const response = await axios.get<IBacklog>(API_URL)
        return response.data
    } catch (error) {
        console.log("Problemas en getBacklogController", error)
    }
}

export const initializeBacklogController = async (): Promise<IBacklog | undefined> => {
    try {
        const response = await axios.post<IBacklog>(API_URL)
        return response.data
    } catch (error) {
        console.log("Problemas en initializeBacklogController", error)
    }
}

export const addTaskToBacklogController = async (tareaId: string): Promise<{ mensaje: string, backlog: IBacklog } | undefined> => {
    try {
        const response = await axios.put<{ mensaje: string, backlog: IBacklog }>(API_URL + `/add-task/${tareaId}`)
        return response.data
    } catch (error) {
        console.log("Problemas en addTaskToBacklogController", error)
    }
}