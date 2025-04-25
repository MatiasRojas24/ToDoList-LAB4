import * as Yup from "yup";

export const crearTareaSchema = Yup.object().shape({
  titulo: Yup.string()
    .required("Este campo es obligatorio")
    .min(3, "El título debe tener al menos 3 caracteres"),
  descripcion: Yup.string().required("Este campo es obligatorio"),
  fechaLimite: Yup.date()
    .required("Este campo es obligatorio")
    .typeError("La fecha límite debe ser válida"),
});
