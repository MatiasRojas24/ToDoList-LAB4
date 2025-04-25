import { useEffect, useState } from "react";
import { useSprints } from "../../../hooks/useSprints";
import { sprintStore } from "../../../store/sprintStore";
import styles from "./Sidebar.module.css";
import { useNavigate } from "react-router-dom";
import { ISprint } from "../../../types/ISprint";
import { SprintListCard } from "../../UI/SprintListCard/SprintListCard";
import { ModalCrearSprint } from "../../UI/ModalCrearSprint/ModalCrearSprint";

export const Sidebar = () => {
  const setSprintActiva = sprintStore((state) => state.setSprintActiva)
  const { getSprints, sprints, eliminarSprint } = useSprints()
  useEffect(() => {
    getSprints()
  }, [])
  const navigate = useNavigate()
  const handleNavigateBacklog = () => {
    navigate("/backlog")
  }
  const handleNavigateSprint = (sprint: ISprint) => {
    setSprintActiva(sprint)
    navigate(`/sprints?sprint=${sprint.id}`)
    setSprintActiva(null)
  }
  const [openModal, setOpenModal] = useState(false)
  const handleCloseModal = () => {
    setOpenModal(false)
  }
  const handleOpenModalEdit = (sprint: ISprint) => {
    setSprintActiva(sprint)
    setOpenModal(true)
  }
  const handleDelete = (idSprint: string) => {
    eliminarSprint(idSprint)
  }
  return (
    <>
      <aside className={styles.sidebar}>
        <button onClick={handleNavigateBacklog} className={styles.backlogButton}>
          Backlog
          <span className={`material-symbols-outlined ${styles.backlogIcon}`}>
            import_contacts
          </span>
        </button>
        <div className={styles.containerListSprints}>
          <h3>
            Lista de Sprints
            <button className={styles.buttonAddSprint} onClick={() => setOpenModal(true)}>
              <span className="material-symbols-outlined">playlist_add</span>
            </button>
          </h3>

          <hr />
          {sprints.length > 0 ? sprints.map((sprint) => (<SprintListCard sprint={sprint} handleNavigateSprint={handleNavigateSprint} handleOpenModalEdit={handleOpenModalEdit} handleDelete={handleDelete} />)) : <h3>No hay Sprints</h3>}
        </div >
      </aside >
      {openModal && <ModalCrearSprint handleCloseModal={handleCloseModal} />}
    </>
  );
};
