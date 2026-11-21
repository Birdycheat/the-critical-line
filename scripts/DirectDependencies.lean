import Lean

open Lean

/-!
Print a JSON line for each named theorem, definition or opaque constant in an
already compiled module. Imports at private visibility retain theorem values.
Within a built checkout, run:

    lake env lean --run /absolute/path/to/DirectDependencies.lean Main riemannHypothesis rhOfAll

The two arrays separate constants in the elaborated type from constants in its
value. This is one expression step; pass a returned name to inspect the next step.
-/

private def namesIn (e : Expr) : Array String :=
  (e.getUsedConstants.qsort Name.lt).map Name.toString

def main (args : List String) : IO UInt32 := do
  let moduleName :: requested := args | do
    IO.eprintln "Usage: DirectDependencies.lean ROOT_MODULE CONSTANT [CONSTANT ...]"
    return 2
  if requested.isEmpty then
    IO.eprintln "Supply at least one constant to inspect."
    return 2
  initSearchPath (← findSysroot)
  let env ← importModules #[{ module := moduleName.toName }] {} (level := .private)
  let modules := env.header.moduleNames
  let mut failed := false
  for label in requested do
    let name := label.toName
    let some info := env.constants.find? name | do
      IO.eprintln s!"Unknown constant: {label}"
      failed := true
      continue
    let body? : Option Expr := match info with
      | .thmInfo t => some t.value
      | .defnInfo d => some d.value
      | .opaqueInfo o => some o.value
      | _ => none
    let some body := body? | do
      IO.eprintln s!"Expected a theorem, definition or opaque constant: {label}"
      failed := true
      continue
    let origin := (env.getModuleIdxFor? name).map fun i => modules[i.toNat]!.toString
    let record := Json.mkObj [
      ("declaration", toJson label), ("module", toJson origin),
      ("type_constants", toJson (namesIn info.type)), ("value_constants", toJson (namesIn body))]
    IO.println record.compress
  return if failed then 1 else 0
