import * as Yup from "yup";

export const crearSprintSchema = Yup.object().shape({
  nombre: Yup.string()
    .required("Este campo es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  fechaInicio: Yup.date()
    .required("Este campo es obligatorio")
    .typeError("La fecha de inicio debe ser válida"),
  fechaCierre: Yup.date()
    .required("Este campo es obligatorio")
    .typeError("La fecha de cierre debe ser válida"),
});
