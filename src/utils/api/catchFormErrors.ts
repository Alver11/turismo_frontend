export function catchFieldError(err: any, setFieldError: any) {
  if (err.response?.status === 422) {
    const errors = err.response.data?.errors
    for (const field in errors) {
      setFieldError(field, errors[field][0])
    }
  }
}
