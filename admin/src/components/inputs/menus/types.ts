export interface Item {
  name: string,
  href?: string,
  items: Array<Item> | null
}