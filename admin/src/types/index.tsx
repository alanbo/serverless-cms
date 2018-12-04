export interface FragmentItem {
  id: string,
  name: string,
  type: string,
  lastModified: number,
  is_deleted?: boolean
}

interface FragmentInput {
  id?: string,
  name?: string,
  [element: string]: any
}

export interface InputProps {
  onChange: (value: FragmentInput) => any,
  value: FragmentInput
}