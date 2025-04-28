import { create } from "zustand";
import { ISprint } from "../types/ISprint";

interface ISprintStore {
    sprints: ISprint[]
    sprintActiva: ISprint | null
    setSprintActiva: (sprintActiva: ISprint | null) => void
    setSprints: (arrayDeSprints: ISprint[]) => void
    agregarNuevaSprint: (nuevaSprint: ISprint) => void
    editarUnaSprint: (sprintActualizada: ISprint) => void
    eliminarUnaSprint: (idSprint: string) => void
}
export const sprintStore = create<ISprintStore>((set) => ({
    sprints: [],
    sprintActiva: null,
    setSprints: (arrayDeSprintsIn) => set(() => ({ sprints: arrayDeSprintsIn })),
    agregarNuevaSprint: (nuevaSprintIn) => set((state) => ({ sprints: [...state.sprints, nuevaSprintIn] })),
    editarUnaSprint: (sprintEditadaIn) => set((state) => {
        const arregloSprint = state.sprints.map((sprint) => sprint._id === sprintEditadaIn._id ? { ...sprint, ...sprintEditadaIn } : sprint)
        return { sprints: arregloSprint }
    }),
    eliminarUnaSprint: (idSprintIn) => set((state) => {
        const arregloSprint = state.sprints.filter((sprint) => sprint._id !== idSprintIn)
        return { sprints: arregloSprint }
    }),
    setSprintActiva: (sprintActivaIn) => set(() => ({ sprintActiva: sprintActivaIn })),
}))