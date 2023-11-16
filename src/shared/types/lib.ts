export interface Wrap<Obj> {
  [prefix: string]: Obj
}

export type Replace<
  Target extends object,
  Property extends keyof Target,
  ReplaceTo
> = Omit<Target, Property> & {
  [Key in Property]: ReplaceTo
}
