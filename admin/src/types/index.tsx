export interface FragmentItem {
  id: string,
  name: string,
  type: string
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