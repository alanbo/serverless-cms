export interface FragmentItem {
  id: string,
  name: string,
  type: string,
  lastModified: number,
  is_deleted?: boolean,
  [field: string]: any
}

export interface FragmentInput {
  id?: string,
  name?: string,
  [element: string]: any
}

export interface InputProps {
  onChange: (value: FragmentInput) => any,
  value: FragmentInput
}

export interface AwsVars {
  endpoint: string,
  graphqlApiId: string,
  bucket: string,
  graphql_endpoint: string,
  region: string
}

interface PageTypeInput {
  name: string
  type: string
  title: string
}

interface PageType {
  name: string
  template: string
  query: string
  inputs: Array<PageTypeInput>
}

export interface PageTypeConfig {
  [type: string]: PageType
}

export interface Fragments {
  [id: string]: FragmentItem
}

export interface FgState {
  fragments: Fragments,
}